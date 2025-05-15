// Initial study videos data
const videos = [
  {id: 'uQvKFH3Ps2o',title:'Calculus Basics - Limits Explained',channel:'MathMaster',views:1200000,viewsStr:'1.2M views',category:'math',duration:'10:05',uploadDate:'2 months ago',trending:true},
  {id: 'X0-XBhZiGlY',title:'Introduction to Quantum Physics',channel:'ScienceDaily',views:800000,viewsStr:'800K views',category:'science',duration:'13:20',uploadDate:'1 month ago',trending:true},
  {id: '9N17vzfqzQI',title:'World War II Summary',channel:'HistoryNow',views:670000,viewsStr:'670K views',category:'history',duration:'19:45',uploadDate:'3 weeks ago',trending:true},
  {id: 'O_W-H67-BXM',title:'Spanish for Beginners - Lesson 1',channel:'LanguageCircle',views:430000,viewsStr:'430K views',category:'language',duration:'15:30',uploadDate:'5 days ago',trending:false},
  {id: 'Lg4H_XWaGfs',title:'Basics of Computer Programming',channel:'TechGeek',views:900000,viewsStr:'900K views',category:'technology',duration:'18:10',uploadDate:'4 weeks ago',trending:true},
  {id: '0tvmOf7cLKg',title:'Introduction to Modern Art',channel:'ArtVibes',views:220000,viewsStr:'220K views',category:'art',duration:'12:00',uploadDate:'1 month ago',trending:false}
];

let loggedInUser = null;
let currentCategory = 'all';

const loginPage = document.getElementById('loginPage');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const app = document.getElementById('app');
const videoGrid = document.getElementById('videoGrid');
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const sidebarItems = document.querySelectorAll('aside .sidebar-item');
const searchInput = document.getElementById('searchInput');
const logo = document.querySelector('.logo');
const userIcon = document.getElementById('userIcon');
const userDropdown = document.getElementById('userDropdown');
const logoutBtn = document.getElementById('logoutBtn');
const usernameDisplay = document.getElementById('usernameDisplay');
const trendingList = document.getElementById('trendingList');
const sortSelect = document.getElementById('sortSelect');
const colorModeToggle = document.getElementById('colorModeToggle');
const notifications = document.getElementById('notifications');
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const uploadBtn = document.getElementById('uploadBtn');
const uploadModal = document.getElementById('uploadModal');
const uploadModalClose = document.getElementById('uploadModalClose');
const uploadForm = document.getElementById('uploadForm');

// Utility Functions
function getThumbnailUrl(id) { return `https://img.youtube.com/vi/${id}/mqdefault.jpg`; }
function formatNumber(num) {
  if (num >= 1e9) return (num/1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num/1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num/1e3).toFixed(1) + 'K';
  return num.toString();
}
function extractYearsAgo(text) {
  if (!text) return 9999;
  const match = text.match(/(\d+)/);
  return match ? parseInt(match[1]) : 9999;
}

// Show/hide upload modal
function openUploadModal() {
  uploadModal.style.opacity = '1';
  uploadModal.style.pointerEvents = 'auto';
  uploadForm.reset();
  document.getElementById('videoTitle').focus();
}
function closeUploadModal() {
  uploadModal.style.opacity = '0';
  uploadModal.style.pointerEvents = 'none';
  uploadBtn.focus();
}

uploadBtn.addEventListener('click', openUploadModal);
uploadModalClose.addEventListener('click', closeUploadModal);
uploadModal.addEventListener('click', (e) => {
  if(e.target === uploadModal) closeUploadModal();
});
document.addEventListener('keydown', (e) => {
  if(e.key === "Escape" && uploadModal.style.pointerEvents==='auto') closeUploadModal();
});

// Login
window.addEventListener('load', () => {
  usernameInput.focus();
  loadColorMode();
});
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loginError.textContent = '';
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username) { loginError.textContent = 'Please enter your username'; usernameInput.focus(); return;}
  if (!password) { loginError.textContent = 'Please enter your password'; passwordInput.focus(); return;}
  loggedInUser = username;
  showApp();
});

function showApp() {
  loginPage.style.display = 'none';
  app.style.display = 'flex';
  userIcon.textContent = loggedInUser.charAt(0).toUpperCase();
  usernameDisplay.textContent = loggedInUser;
  searchInput.value = '';
  currentCategory = 'all';
  sidebarItems.forEach(i=>i.classList.remove('active'));
  sidebarItems[0].classList.add('active');
  usernameInput.value = ''; passwordInput.value = ''; loginError.textContent = '';
  usernameInput.blur(); passwordInput.blur();
  initApp();
  searchInput.focus();
}

logoutBtn.addEventListener('click', () => {
  loggedInUser=null;
  app.style.display='none';
  loginPage.style.display='flex';
  userDropdown.classList.remove('show');
  userIcon.setAttribute('aria-expanded','false');
  usernameDisplay.textContent='';
  usernameInput.focus();
});

// User dropdown toggle and accessibility
userIcon.addEventListener('click', toggleUserDropdown);
userIcon.addEventListener('keydown', (e) => {
  if(['Enter',' '].includes(e.key)) { e.preventDefault(); toggleUserDropdown(); }
  else if(e.key==='Escape') { closeUserDropdown(); userIcon.focus(); }
});
logoutBtn.addEventListener('keydown', (e) => { if(e.key==='Escape'){ closeUserDropdown(); userIcon.focus(); } });
function toggleUserDropdown() {
  let isShown = userDropdown.classList.toggle('show');
  userIcon.setAttribute('aria-expanded', isShown.toString());
  if(isShown) logoutBtn.focus();
}
function closeUserDropdown() {
  userDropdown.classList.remove('show');
  userIcon.setAttribute('aria-expanded','false');
}
document.addEventListener('click', e=>{ if(!userIcon.contains(e.target)) closeUserDropdown(); });

// Sidebar toggle mobile
hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});
hamburger.addEventListener('keydown', e => {
  if(['Enter',' '].includes(e.key)) {
    e.preventDefault();
    sidebar.classList.toggle('open');
  }
});
document.addEventListener('click', e => {
  if(!sidebar.contains(e.target) && !hamburger.contains(e.target) && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
  }
});

// Color Mode (dark/light)
function loadColorMode() {
  const mode = localStorage.getItem('yt-color-mode') || 'dark';
  if(mode==='light'){
    document.documentElement.style.setProperty('--bg-color','#f9f9f9');
    document.body.style.backgroundColor='#f9f9f9';
    colorModeToggle.textContent='☀️';
    document.body.style.color='#111';
  } else {
    document.documentElement.style.setProperty('--bg-color','#181818');
    document.body.style.backgroundColor='#181818';
    colorModeToggle.textContent='🌙';
    document.body.style.color='#fff';
  }
}
function toggleColorMode() {
  if(document.body.style.backgroundColor==='rgb(24, 24, 24)'){
    localStorage.setItem('yt-color-mode','light');
    document.documentElement.style.setProperty('--bg-color','#f9f9f9');
    document.body.style.backgroundColor='#f9f9f9';
    document.body.style.color='#111';
    colorModeToggle.textContent='☀️';
  } else {
    localStorage.setItem('yt-color-mode','dark');
    document.documentElement.style.setProperty('--bg-color','#181818');
    document.body.style.backgroundColor='#181818';
    document.body.style.color='#fff';
    colorModeToggle.textContent='🌙';
  }
}
colorModeToggle.addEventListener('click', toggleColorMode);
colorModeToggle.addEventListener('keydown', e => {
  if(['Enter',' '].includes(e.key)) { e.preventDefault(); toggleColorMode(); }
});

// Notifications alerts
notifications.addEventListener('click', ()=>alert('No new notifications (Demo)'));
notifications.addEventListener('keydown', e => {
  if(['Enter',' '].includes(e.key)) { e.preventDefault(); alert('No new notifications (Demo)'); }
});

// Render trending videos horizontally
function renderTrending() {
  trendingList.innerHTML = '';
  const trendingVideos = videos.filter(v => v.trending);
  trendingVideos.forEach(video=>{
    const item=document.createElement('div');
    item.className='trending-item';
    item.tabIndex=0;
    item.setAttribute('role','button');
    item.setAttribute('aria-label', `Play trending video: ${video.title} by ${video.channel}`);
    item.innerHTML=`
      <img class="trending-thumb" src="${getThumbnailUrl(video.id)}" alt="Thumbnail of trending video: ${video.title}" />
      <div class="trending-info">
        <div class="trending