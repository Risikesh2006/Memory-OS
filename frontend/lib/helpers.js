// Frontend quick reference for common operations

// Authentication
export async function login(email, password) {
  const { default: api } = await import('./lib/api');
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return { token, user };
}

// Photos
export async function uploadPhoto(file, title) {
  const { cloudinaryService } = await import('./lib/cloudinary');
  const url = await cloudinaryService.uploadImage(file);
  const { photoAPI } = await import('./lib/apiService');
  const response = await photoAPI.create({ title, url });
  return response.data;
}

// Videos
export async function uploadVideo(file, title) {
  const { cloudinaryService } = await import('./lib/cloudinary');
  const url = await cloudinaryService.uploadVideo(file);
  const { videoAPI } = await import('./lib/apiService');
  const response = await videoAPI.create({ title, url });
  return response.data;
}

// Journals
export async function createJournal(title, content, mood) {
  const { journalAPI } = await import('./lib/apiService');
  const response = await journalAPI.create({ title, content, mood });
  return response.data;
}

// Milestones
export async function createMilestone(title, description, date, category) {
  const { milestoneAPI } = await import('./lib/apiService');
  const response = await milestoneAPI.create({
    title,
    description,
    date,
    category,
  });
  return response.data;
}

// Timeline
export async function getTimeline() {
  const { timelineAPI } = await import('./lib/apiService');
  const response = await timelineAPI.getAll();
  return response.data;
}

export async function getTimelineByYear(year) {
  const { timelineAPI } = await import('./lib/apiService');
  const response = await timelineAPI.getByYear(year);
  return response.data;
}
