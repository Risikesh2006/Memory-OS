const Photo = require('../models/Photo');
const Video = require('../models/Video');
const Journal = require('../models/Journal');
const Milestone = require('../models/Milestone');
const ChatHistory = require('../models/ChatHistory');
const { Op } = require('sequelize');

// Helper: search across all memory types
async function searchMemories(userId, query) {
  const q = `%${query}%`;
  const where = { userId };
  const likeTitle = { title: { [Op.like]: q } };
  const likeDesc = { [Op.or]: [{ title: { [Op.like]: q } }, { description: { [Op.like]: q } }] };

  const [photos, videos, journals, milestones] = await Promise.all([
    Photo.findAll({ where: { ...where, ...likeTitle }, raw: true }),
    Video.findAll({ where: { ...where, ...likeTitle }, raw: true }),
    Journal.findAll({
      where: { ...where, [Op.or]: [{ title: { [Op.like]: q } }, { content: { [Op.like]: q } }] },
      raw: true,
    }),
    Milestone.findAll({ where: { ...where, ...likeDesc }, raw: true }),
  ]);

  return [
    ...photos.map(p => ({ ...p, memoryType: 'photo', date: p.createdAt })),
    ...videos.map(v => ({ ...v, memoryType: 'video', date: v.createdAt })),
    ...journals.map(j => ({ ...j, memoryType: 'journal', date: j.createdAt })),
    ...milestones.map(m => ({ ...m, memoryType: 'milestone', date: m.date || m.createdAt })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Helper: get all memories for a user
async function getAllMemories(userId) {
  const [photos, videos, journals, milestones] = await Promise.all([
    Photo.findAll({ where: { userId }, raw: true }),
    Video.findAll({ where: { userId }, raw: true }),
    Journal.findAll({ where: { userId }, raw: true }),
    Milestone.findAll({ where: { userId }, raw: true }),
  ]);

  return [
    ...photos.map(p => ({ ...p, memoryType: 'photo', date: p.createdAt })),
    ...videos.map(v => ({ ...v, memoryType: 'video', date: v.createdAt })),
    ...journals.map(j => ({ ...j, memoryType: 'journal', date: j.createdAt })),
    ...milestones.map(m => ({ ...m, memoryType: 'milestone', date: m.date || m.createdAt })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// AI Semantic Search
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query is required' });

    // Extract keywords and context from natural language query
    const keywords = q.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const results = [];

    // Search each keyword
    for (const keyword of keywords) {
      const found = await searchMemories(req.user.id, keyword);
      found.forEach(item => {
        if (!results.find(r => r.id === item.id)) {
          // Calculate relevance score based on keyword matches
          let score = 0;
          const titleLower = (item.title || '').toLowerCase();
          const descLower = (item.description || item.content || '').toLowerCase();
          if (titleLower.includes(keyword)) score += 10;
          if (descLower.includes(keyword)) score += 5;
          keywords.forEach(kw => {
            if (titleLower.includes(kw)) score += 3;
            if (descLower.includes(kw)) score += 1;
          });
          results.push({ ...item, relevanceScore: score });
        }
      });
    }

    // Sort by relevance
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Generate related suggestions
    const types = [...new Set(results.map(r => r.memoryType))];
    const suggestions = [];
    if (types.includes('photo')) suggestions.push('Show more photos like this');
    if (types.includes('journal')) suggestions.push('Find similar journal entries');
    if (results.length > 0) suggestions.push('Show memories from the same period');

    res.json({ results: results.slice(0, 50), suggestions, total: results.length });
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

// AI Chat with Memories
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const allMemories = await getAllMemories(req.user.id);
    const msgLower = message.toLowerCase();

    // Intelligent response generation based on memory context
    let response = '';
    let memoryRefs = [];

    // Detect intent
    const isWhenQuestion = /when|what time|which year|which month|what date/.test(msgLower);
    const isCountQuestion = /how many|count|total|number of/.test(msgLower);
    const isShowRequest = /show|find|get|display|look for/.test(msgLower);
    const isAboutQuestion = /what did i|what have i|tell me about|describe/.test(msgLower);
    const isSummaryRequest = /summary|summarize|overview|recap/.test(msgLower);

    // Extract keywords from the message (skip common words)
    const stopWords = ['show', 'me', 'my', 'the', 'a', 'an', 'all', 'find', 'get', 'what', 'when', 'where', 'how', 'did', 'do', 'i', 'have', 'with', 'from', 'in', 'of', 'to', 'and', 'is', 'was', 'are', 'were', 'been', 'about', 'tell', 'many', 'much'];
    const searchKeywords = msgLower.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));

    // Search for relevant memories
    let relevantMemories = [];
    for (const kw of searchKeywords) {
      const found = allMemories.filter(m => {
        const text = `${m.title || ''} ${m.description || ''} ${m.content || ''} ${m.category || ''}`.toLowerCase();
        return text.includes(kw);
      });
      found.forEach(m => {
        if (!relevantMemories.find(r => r.id === m.id)) relevantMemories.push(m);
      });
    }

    // Year-specific queries
    const yearMatch = msgLower.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      const yearMemories = allMemories.filter(m => new Date(m.date).getFullYear() === year);
      if (yearMemories.length > 0) {
        relevantMemories = yearMemories;
      }
    }

    memoryRefs = relevantMemories.slice(0, 5).map(m => ({
      id: m.id,
      title: m.title,
      type: m.memoryType,
      date: m.date,
      url: m.url || null,
    }));

    // Generate contextual response
    if (isCountQuestion) {
      if (searchKeywords.length > 0 && relevantMemories.length > 0) {
        response = `I found ${relevantMemories.length} memories matching "${searchKeywords.join(' ')}". `;
        const byType = {};
        relevantMemories.forEach(m => { byType[m.memoryType] = (byType[m.memoryType] || 0) + 1; });
        const breakdown = Object.entries(byType).map(([t, c]) => `${c} ${t}${c > 1 ? 's' : ''}`).join(', ');
        response += `That includes ${breakdown}.`;
      } else {
        response = `You have ${allMemories.length} total memories. `;
        const byType = {};
        allMemories.forEach(m => { byType[m.memoryType] = (byType[m.memoryType] || 0) + 1; });
        const breakdown = Object.entries(byType).map(([t, c]) => `${c} ${t}${c > 1 ? 's' : ''}`).join(', ');
        response += `That's ${breakdown}.`;
      }
    } else if ((isShowRequest || isAboutQuestion) && relevantMemories.length > 0) {
      response = `Here are ${relevantMemories.length} memories I found related to "${searchKeywords.join(' ')}". `;
      const latest = relevantMemories[0];
      response += `The most recent one is "${latest.title}" from ${new Date(latest.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`;
    } else if (isWhenQuestion && relevantMemories.length > 0) {
      const earliest = relevantMemories[relevantMemories.length - 1];
      response = `The earliest memory I found about "${searchKeywords.join(' ')}" is "${earliest.title}" from ${new Date(earliest.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`;
    } else if (isSummaryRequest) {
      const thisYear = allMemories.filter(m => new Date(m.date).getFullYear() === new Date().getFullYear());
      response = `Here's your memory summary: You have ${allMemories.length} total memories. `;
      response += `This year alone, you've created ${thisYear.length} memories. `;
      if (allMemories.length > 0) {
        const firstDate = new Date(allMemories[allMemories.length - 1].date);
        response += `Your journey started on ${firstDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`;
      }
    } else if (relevantMemories.length > 0) {
      response = `I found ${relevantMemories.length} memories related to your query. Here are the most relevant ones.`;
    } else if (searchKeywords.length > 0) {
      response = `I couldn't find any memories matching "${searchKeywords.join(' ')}". Try different keywords or browse your timeline for more memories.`;
    } else {
      response = `I'm your Legacy OS memory assistant! You can ask me things like:\n• "How many photos do I have?"\n• "Show memories from 2025"\n• "When was my first milestone?"\n• "Tell me about my travel memories"`;
    }

    // Save to chat history
    await ChatHistory.create({
      userId: req.user.id,
      message,
      response,
      memoryRefs,
    });

    res.json({ response, memoryRefs });
  } catch (error) {
    res.status(500).json({ message: 'Chat failed', error: error.message });
  }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const history = await ChatHistory.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'ASC']],
      limit: 100,
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat history', error: error.message });
  }
};

// On This Day - get memories from same day in previous years
exports.onThisDay = async (req, res) => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const allMemories = await getAllMemories(req.user.id);

    const onThisDayMemories = allMemories.filter(m => {
      const memDate = new Date(m.date);
      return memDate.getMonth() + 1 === month && memDate.getDate() === day && memDate.getFullYear() !== today.getFullYear();
    });

    // Group by year
    const byYear = {};
    onThisDayMemories.forEach(m => {
      const year = new Date(m.date).getFullYear();
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(m);
    });

    res.json({
      date: { month, day },
      memories: onThisDayMemories,
      byYear,
      totalYears: Object.keys(byYear).length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch on this day memories', error: error.message });
  }
};

// Life Insights (AI Companion)
exports.insights = async (req, res) => {
  try {
    const allMemories = await getAllMemories(req.user.id);
    const now = new Date();
    const thisMonth = allMemories.filter(m => {
      const d = new Date(m.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const thisYear = allMemories.filter(m => new Date(m.date).getFullYear() === now.getFullYear());

    // Category breakdown
    const byType = {};
    allMemories.forEach(m => { byType[m.memoryType] = (byType[m.memoryType] || 0) + 1; });

    // Monthly trend
    const monthlyTrend = {};
    allMemories.forEach(m => {
      const key = new Date(m.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyTrend[key] = (monthlyTrend[key] || 0) + 1;
    });

    // Streak calculation
    let streak = 0;
    const dateSet = new Set(allMemories.map(m => new Date(m.date).toISOString().split('T')[0]));
    let checkDate = new Date();
    while (dateSet.has(checkDate.toISOString().split('T')[0])) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Generate insight messages
    const insights = [];
    insights.push({
      type: 'stat',
      icon: '📊',
      title: 'Monthly Activity',
      message: `You've created ${thisMonth.length} memories this month.`,
    });
    insights.push({
      type: 'streak',
      icon: '🔥',
      title: 'Current Streak',
      message: streak > 0 ? `${streak} day streak! Keep it going!` : 'Start your streak by adding a memory today!',
    });
    if (allMemories.length > 0) {
      const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
      insights.push({
        type: 'pattern',
        icon: '🎯',
        title: 'Your Style',
        message: `You love creating ${topType[0]}s — ${topType[1]} total and counting!`,
      });
    }
    insights.push({
      type: 'milestone',
      icon: '🏆',
      title: 'Year Progress',
      message: `${thisYear.length} memories created in ${now.getFullYear()} so far.`,
    });
    if (allMemories.length >= 100) {
      insights.push({
        type: 'achievement',
        icon: '⭐',
        title: 'Century Club',
        message: `Amazing! You've passed ${Math.floor(allMemories.length / 100) * 100} memories!`,
      });
    }

    res.json({
      insights,
      stats: {
        total: allMemories.length,
        thisMonth: thisMonth.length,
        thisYear: thisYear.length,
        streak,
        byType,
        monthlyTrend,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate insights', error: error.message });
  }
};

// Get all memories (for documentary / replay / book generator)
exports.getAllMemories = async (req, res) => {
  try {
    const memories = await getAllMemories(req.user.id);
    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch memories', error: error.message });
  }
};

// Generate documentary narrative
exports.generateNarrative = async (req, res) => {
  try {
    const { memoryIds, duration } = req.body;
    const allMemories = await getAllMemories(req.user.id);

    let selected = allMemories;
    if (memoryIds && memoryIds.length > 0) {
      selected = allMemories.filter(m => memoryIds.includes(m.id));
    }

    if (selected.length === 0) {
      return res.json({ chapters: [], narrative: 'No memories selected for documentary.' });
    }

    selected.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Group into chapters by time periods
    const chapters = [];
    let currentChapter = { title: '', memories: [], period: '' };

    selected.forEach((memory, index) => {
      const date = new Date(memory.date);
      const period = date.toLocaleString('default', { month: 'long', year: 'numeric' });

      if (period !== currentChapter.period) {
        if (currentChapter.memories.length > 0) chapters.push({ ...currentChapter });
        currentChapter = {
          title: `Chapter ${chapters.length + 1}: ${period}`,
          memories: [],
          period,
          narrative: `During ${period}, you experienced ${currentChapter.memories.length} memorable moments.`,
        };
      }
      currentChapter.memories.push(memory);
    });
    if (currentChapter.memories.length > 0) chapters.push(currentChapter);

    // Generate chapter narratives
    chapters.forEach((ch, i) => {
      const types = [...new Set(ch.memories.map(m => m.memoryType))];
      ch.narrative = `${ch.period} was a time of ${types.join(' and ')} memories. You created ${ch.memories.length} ${ch.memories.length === 1 ? 'memory' : 'memories'} during this chapter of your life.`;
    });

    const narrative = {
      title: 'Your Life Documentary',
      subtitle: `A journey through ${selected.length} memories`,
      chapters,
      totalMemories: selected.length,
      dateRange: {
        from: selected[0].date,
        to: selected[selected.length - 1].date,
      },
      duration: duration || '5min',
    };

    res.json(narrative);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate narrative', error: error.message });
  }
};
