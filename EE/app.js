// --- HISTORIQUE DES APPELS & JOURNAL ---
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeHistory = document.getElementById('closeHistory');
const callHistoryList = document.getElementById('callHistoryList');
const activityLogList = document.getElementById('activityLogList');

let callHistory = JSON.parse(localStorage.getItem('callHistory')||'[]');
let activityLog = JSON.parse(localStorage.getItem('activityLog')||'[]');

function addCallHistory(type, contact) {
    callHistory.unshift({type, contact, date: new Date().toLocaleString()});
    callHistory = callHistory.slice(0, 50);
    localStorage.setItem('callHistory', JSON.stringify(callHistory));
}
function addActivityLog(action) {
    activityLog.unshift({action, date: new Date().toLocaleString()});
    activityLog = activityLog.slice(0, 100);
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
}
function renderHistory() {
    callHistoryList.innerHTML = callHistory.map(e=>`<li>${e.date} - <b>${e.type}</b> avec <b>${e.contact||'?'}</b></li>`).join('')||'<li>Aucun appel</li>';
    activityLogList.innerHTML = activityLog.map(e=>`<li>${e.date} - ${e.action}</li>`).join('')||'<li>Aucune activité</li>';
}
historyBtn.onclick = function() {
    renderHistory();
    historyModal.style.display = 'flex';
};
closeHistory.onclick = function() {
    historyModal.style.display = 'none';
};


// --- THÈME SOMBRE/CLAIR ---
const themeToggleBtn = document.getElementById('themeToggleBtn');
function setTheme(mode) {
    if (mode === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = 'Mode clair';
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = 'Mode sombre';
    }
}
themeToggleBtn.onclick = function() {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
};
// Appliquer le thème au chargement
setTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
// --- RECHERCHE RAPIDE ---
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function() {
    const query = searchInput.value.trim().toLowerCase();
    // Filtrer les contacts
    const userListItems = document.querySelectorAll('#userList li');
    userListItems.forEach(li => {
     const name = li.textContent.toLowerCase();
        li.style.display = name.includes(query) ? '' : 'none';
    });
    // Filtrer les messages (dans la vue active)
    const messageDivs = document.querySelectorAll('#messages .message');
    messageDivs.forEach(div => {
        const txt = div.textContent.toLowerCase();
        div.style.display = txt.includes(query) ? '' : 'none';
    });
});
// --- SAUVEGARDE/RESTAURATION DONNÉES ---
const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const importDataInput = document.getElementById('importDataInput');

function saveAllData() {
    const data = {
        users: window.users || [],
        messages: window.messages || [],
        tasks: tasks || [],
        statuses: window.statuses || [],
        profile: window.profile || {},
    };
    localStorage.setItem('mambuAppData', JSON.stringify(data));
}

function loadAllData() {
    const data = JSON.parse(localStorage.getItem('mambuAppData'));
    if (data) {
        if (data.users) window.users = data.users;
        if (data.messages) window.messages = data.messages;
        if (data.tasks) tasks = data.tasks;
        if (data.statuses) window.statuses = data.statuses;
        if (data.profile) window.profile = data.profile;
    }
}

// Sauvegarde auto à chaque modification de tâches/messages/utilisateurs (exemple pour tâches)
function saveTasks() {
    saveAllData();
}

// Appeler saveTasks() après chaque ajout/édition/suppression de tâche !

// Chargement auto au démarrage
loadAllData();
// Gestion des utilisateurs et des messages
const userList = document.getElementById('userList');
const addUserForm = document.getElementById('addUserForm');
const userNameInput = document.getElementById('userName');
const userNumberInput = document.getElementById('userNumber');
const messagesDiv = document.getElementById('messages');
const sendForm = document.getElementById('sendForm');
const messageInput = document.getElementById('messageInput');
const photoInput = document.getElementById('photoInput');
const videoInput = document.getElementById('videoInput');
const musicInput = document.getElementById('musicInput');
const docInput = document.getElementById('docInput');
const audioInput = document.getElementById('audioInput');

const tasksBtn = document.getElementById('tasksBtn');
const tasksModal = document.getElementById('tasksModal');
const closeTasksBtn = document.getElementById('closeTasks');
const addTaskForm = document.getElementById('addTaskForm');
const taskTextInput = document.getElementById('taskText');
const taskDateInput = document.getElementById('taskDate');
const taskTimeInput = document.getElementById('taskTime');
const tasksList = document.getElementById('tasksList');

let tasks = [];

tasksBtn.onclick = function() {
    renderTasks();
    tasksModal.style.display = 'flex';
};
closeTasksBtn.onclick = function() {
    tasksModal.style.display = 'none';
};

addTaskForm.onsubmit = function(e) {
    e.preventDefault();
    const text = taskTextInput.value.trim();
    const date = taskDateInput.value;
    const time = taskTimeInput.value;
    if (!text || !date || !time) return;
    const id = Date.now();
    tasks.push({ id, text, date, time, done: false });
    renderTasks();
    taskTextInput.value = '';
    taskDateInput.value = '';
    taskTimeInput.value = '';
    checkAlarms();
};

function renderTasks() {
    tasksList.innerHTML = '';
    if (tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty">Aucune tâche enregistrée.</div>';
        return;
    }
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.style = 'display:flex;align-items:center;gap:8px;background:#f3f4f6;padding:8px 12px;border-radius:8px;';
        div.innerHTML = `
            <input type="checkbox" ${task.done ? 'checked' : ''} data-id="${task.id}" />
            <span style="text-decoration:${task.done ? 'line-through' : 'none'}">${task.text} <span class="small-muted">[${task.date} ${task.time}]</span></span>
            <button data-id="${task.id}" class="edit-task" style="background:#f59e42;color:white;border:none;padding:2px 8px;border-radius:6px;">✏️</button>
            <button data-id="${task.id}" class="delete-task" style="background:#ef4444;color:white;border:none;padding:2px 8px;border-radius:6px;">🗑️</button>
        `;
        tasksList.appendChild(div);
    });

    // Checkbox
    tasksList.querySelectorAll('input[type=checkbox]').forEach(cb => {
        cb.onchange = function() {
            const id = Number(cb.dataset.id);
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.done = cb.checked;
                renderTasks();
            }
        };
    });
    // Edit
    tasksList.querySelectorAll('.edit-task').forEach(btn => {
        btn.onclick = function() {
            const id = Number(btn.dataset.id);
            const task = tasks.find(t => t.id === id);
            if (task) {
                taskTextInput.value = task.text;
                taskDateInput.value = task.date;
                taskTimeInput.value = task.time;
                tasks = tasks.filter(t => t.id !== id);
                renderTasks();
            }
        };
    });
    // Delete
    tasksList.querySelectorAll('.delete-task').forEach(btn => {
        btn.onclick = function() {
            const id = Number(btn.dataset.id);
            tasks = tasks.filter(t => t.id !== id);
            renderTasks();
        };
    });
}



// Sonnerie d'alarme (audio simple)
const alarmAudio = new Audio('https://cdn.pixabay.com/audio/2022/10/16/audio_12c6fae3b7.mp3'); // Sonnerie libre de droits

// Demande de permission pour notifications de bureau
if (window.Notification && Notification.permission !== 'granted') {
    Notification.requestPermission();
}

function checkAlarms() {
    setInterval(() => {
        const now = new Date();
        tasks.forEach(task => {
            if (!task.done && task.date && task.time) {
                const taskDateTime = new Date(`${task.date}T${task.time}`);
                if (
                    Math.abs(now - taskDateTime) < 1000 // 1 seconde de tolérance
                ) {
                    // Sonnerie + alerte + notification
                    alarmAudio.currentTime = 0;
                    alarmAudio.play();
                    alert(`⏰ Alarme pour la tâche : ${task.text}`);
                    if (window.Notification && Notification.permission === 'granted') {
                        new Notification('Alarme tâche', {
                            body: `⏰ ${task.text}`,
                            icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827370.png',
                        });
                    }
                }
            }
        });
    }, 1000);
}
// Notification de bureau pour nouveaux messages (à appeler lors de la réception d'un message)
function notifyNewMessage(msg, from) {
    if (window.Notification && Notification.permission === 'granted') {
        new Notification('Nouveau message', {
            body: `De ${from} : ${msg}`,
            icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827370.png',
        });
    }
}
checkAlarms();

const healthBtn = document.getElementById('healthBtn');
const healthModal = document.getElementById('healthModal');
const closeHealthBtn = document.getElementById('closeHealth');
const scanFingerprintBtn = document.getElementById('scanFingerprintBtn');
const healthResult = document.getElementById('healthResult');

healthBtn.onclick = function() {
    healthResult.innerHTML = '';
    healthModal.style.display = 'flex';
};
closeHealthBtn.onclick = function() {
    healthModal.style.display = 'none';
};
scanFingerprintBtn.onclick = function() {
    healthResult.innerHTML = 'Analyse en cours...';
    setTimeout(() => {
        // Résultat fictif
        healthResult.innerHTML = "<b>Diagnostic :</b> Aucun problème détecté.<br>Continuez à prendre soin de votre santé !";
    }, 2000);
};

const downloadAudioBtn = document.getElementById('downloadAudioBtn');
const downloadAudioModal = document.getElementById('downloadAudioModal');
const closeDownloadAudioBtn = document.getElementById('closeDownloadAudio');
const audioSearchForm = document.getElementById('audioSearchForm');
const audioArtistInput = document.getElementById('audioArtist');
const audioResults = document.getElementById('audioResults');

downloadAudioBtn.onclick = function() {
    audioResults.innerHTML = '';
    audioArtistInput.value = '';
    downloadAudioModal.style.display = 'flex';
};
closeDownloadAudioBtn.onclick = function() {
    downloadAudioModal.style.display = 'none';
};
audioSearchForm.onsubmit = function(e) {
    e.preventDefault();
    const artist = audioArtistInput.value.trim();
    if (!artist) {
        audioResults.innerHTML = '<div class="empty">Veuillez entrer un nom d\'artiste.</div>';
        return;
    }
    // Résultats fictifs pour la démo
    const fakeAudios = [
        { title: `Best of ${artist} #1`, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { title: `Best of ${artist} #2`, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { title: `Best of ${artist} #3`, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
    ];
    let html = '';
    fakeAudios.forEach(audio => {
        html += `<div style='display:flex;align-items:center;gap:8px;'>
            <span>${audio.title}</span>
            <audio src="${audio.url}" controls style="height:24px;"></audio>
            <a href="${audio.url}" download style="background:#4f46e5;color:white;padding:4px 10px;border-radius:6px;text-decoration:none;">Télécharger</a>
        </div>`;
    });
    audioResults.innerHTML = html;
};

const settingsBtn = document.getElementById('settingsBtn'); 
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettings');
const profileForm = document.getElementById('profileForm');
const profileNameInput = document.getElementById('profileName');
const profileNumberInput = document.getElementById('profileNumber');
const profileEmailInput = document.getElementById('profileEmail');
const profilePhotoInput = document.getElementById('profilePhoto');
const profilePositionInput = document.getElementById('profilePosition');
const appLangSelect = document.getElementById('appLang');
const inviteBtn = document.getElementById('inviteBtn');
let profilePhotoUrl = '';

let userProfile = {
    name: '',
    number: '',
    email: '',
    photo: '',
    position: '',
    lang: 'fr'
};

settingsBtn.onclick = function() {
    settingsModal.style.display = 'flex';
    profileNameInput.value = userProfile.name;
    profileNumberInput.value = userProfile.number;
    profileEmailInput.value = userProfile.email;
    profilePositionInput.value = userProfile.position;
    appLangSelect.value = userProfile.lang;
    if (userProfile.photo) {
        if (!document.getElementById('profilePreview')) {
            const img = document.createElement('img');
            img.id = 'profilePreview';
            img.src = userProfile.photo;
            img.style = 'width:64px;height:64px;border-radius:50%;object-fit:cover;margin-bottom:8px;align-self:center;';
            profileForm.insertBefore(img, profileForm.firstChild);
        } else {
            document.getElementById('profilePreview').src = userProfile.photo;
        }
    } else if (document.getElementById('profilePreview')) {
        document.getElementById('profilePreview').remove();
    }
};
profilePhotoInput.onchange = function() {
    if (profilePhotoInput.files.length) {
        profilePhotoUrl = URL.createObjectURL(profilePhotoInput.files[0]);
        if (!document.getElementById('profilePreview')) {
            const img = document.createElement('img');
            img.id = 'profilePreview';
            img.src = profilePhotoUrl;
            img.style = 'width:64px;height:64px;border-radius:50%;object-fit:cover;margin-bottom:8px;align-self:center;';
            profileForm.insertBefore(img, profileForm.firstChild);
        } else {
            document.getElementById('profilePreview').src = profilePhotoUrl;
        }
    }
};
profileForm.onsubmit = function(e) {
    e.preventDefault();
    userProfile.name = profileNameInput.value.trim();
    userProfile.number = profileNumberInput.value.trim();
    userProfile.email = profileEmailInput.value.trim();
    userProfile.position = profilePositionInput.value.trim();
    userProfile.lang = appLangSelect.value;
    userProfile.photo = profilePhotoUrl;
    settingsModal.style.display = 'none';
    // Optionnel: changer la langue de l'UI ici
};
closeSettingsBtn.onclick = function() {
    settingsModal.style.display = 'none';
};
inviteBtn.onclick = function() {
    alert('Lien d’invitation copié ou envoyé !');
};

const viewProfileBtn = document.getElementById('viewProfileBtn');
const profileModal = document.getElementById('profileModal');
const closeProfileBtn = document.getElementById('closeProfile');
const profileViewContent = document.getElementById('profileViewContent');
const editProfileBtn = document.getElementById('editProfileBtn');

viewProfileBtn.onclick = function() {
    showProfileModal(true);
};
closeProfileBtn.onclick = function() {
    profileModal.style.display = 'none';
};
editProfileBtn.onclick = function() {
    profileModal.style.display = 'none';
    settingsModal.style.display = 'flex';
};

function showProfileModal(isSelf) {
    profileModal.style.display = 'flex';
    let html = '';
    if (userProfile.photo) {
        html += `<img src="${userProfile.photo}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;">`;
    }
    html += `<div><strong>Nom:</strong> ${userProfile.name || '-'}</div>`;
    html += `<div><strong>Numéro:</strong> ${userProfile.number || '-'}</div>`;
    html += `<div><strong>Email:</strong> ${userProfile.email || '-'}</div>`;
    html += `<div><strong>Position:</strong> ${userProfile.position || '-'}</div>`;
    html += `<div><strong>Langue:</strong> ${userProfile.lang || '-'}</div>`;
    profileViewContent.innerHTML = html;
    editProfileBtn.style.display = isSelf ? '' : 'none';
}

let users = [
    { name: "MANNY MBUYA", number: "+243977510025", blocked: false, online: true },
    { name: "MAMAN CHERIE", number: "+243813752313", blocked: false, online: false }
];
let selectedUser = null;
let messages = {};
let editingUserNumber = null;

function renderUsers() {
    userList.innerHTML = '';
    users.forEach((user, idx) => {
        const li = document.createElement('li');
        li.className = 'user-item' + (selectedUser === user.number ? ' active' : '');
        let blockLabel = user.blocked ? 'Débloquer' : 'Bloquer';
        let onlineDot = user.online ? '<span style="display:inline-block;width:10px;height:10px;background:#22c55e;border-radius:50%;margin-right:6px;vertical-align:middle;"></span>' : '';
        li.innerHTML = `${onlineDot}<span>${user.name || user.number}${user.blocked ? " <span style=\"color:red\">(bloqué)</span>" : ""}</span>
            <div style="display:flex;gap:4px;">
                <button class='edit-btn' data-number='${user.number}' title='Modifier'>✏️</button>
                <button class='delete-btn' data-number='${user.number}' title='Supprimer'>🗑️</button>
                <button class='block-btn' data-number='${user.number}' title='Bloquer/Débloquer'>${blockLabel}</button>
            </div>`;
        li.onclick = (e) => {
            if (e.target.tagName === 'BUTTON') return;
            if (!user.blocked) selectUser(user.number);
        };
        userList.appendChild(li);
    });
    // Ajout listeners boutons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            startEditUser(btn.dataset.number);
        };
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            deleteUser(btn.dataset.number);
        };
    });
    document.querySelectorAll('.block-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            toggleBlockUser(btn.dataset.number);
        };
    });
}

function selectUser(number) {
    selectedUser = number;
    const user = users.find(u => u.number === number);
    document.getElementById('chatContactName').textContent = user ? (user.name || user.number) : 'Sélectionnez un contact';
    document.getElementById('callBtn').style.display = '';
    document.getElementById('videoCallBtn').style.display = '';
    renderUsers();
    renderMessages();
}

function renderMessages() {
    messagesDiv.innerHTML = '';
    if (!selectedUser) {
        messagesDiv.innerHTML = '<div class="empty">Sélectionnez un contact pour commencer à discuter.</div>';
        document.getElementById('callBtn').style.display = 'none';
        document.getElementById('videoCallBtn').style.display = 'none';
        return;
    }
    const msgs = messages[selectedUser] || [];
    if (msgs.length === 0) {
        messagesDiv.innerHTML = '<div class="empty">Aucun message pour ce contact.</div>';
        return;
    }
    msgs.forEach((msg, idx) => {
        const div = document.createElement('div');
        div.className = 'msg ' + (msg.fromMe ? 'me' : 'them');
        let content = '';
        if (msg.text) {
            content = msg.text;
        } else if (msg.photo) {
            content = `<img src="${msg.photo}" alt="photo" style="max-width:180px;border-radius:8px;">`;
        } else if (msg.video) {
            content = `<video src="${msg.video}" controls style="max-width:180px;border-radius:8px;"></video>`;
        } else if (msg.music) {
            content = `<audio src="${msg.music}" controls></audio>`;
        } else if (msg.doc) {
            content = `<a href="${msg.doc.url}" download style="color:#4f46e5">📄 ${msg.doc.name}</a>`;
        } else if (msg.audio) {
            content = `<audio src="${msg.audio}" controls></audio>`;
        }
        // Ajout du statut
        let status = '';
        if (msg.fromMe) {
            if (!msg.status) msg.status = 'envoyé';
            status = `<span class="small-muted">${msg.status}</span>`;
        } else if (msg.status) {
            status = `<span class="small-muted">${msg.status}</span>`;
        }
        div.innerHTML = content + '<br>' + status;
        messagesDiv.appendChild(div);
        // Marquer comme lu si reçu
        if (!msg.fromMe && msg.status === 'réçu') {
            setTimeout(() => {
                msg.status = 'lu';
                renderMessages();
            }, 1000);
        }
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function startEditUser(number) {
    const user = users.find(u => u.number === number);
    if (!user) return;
    editingUserNumber = number;
    document.getElementById('editUserName').value = user.name || '';
    document.getElementById('editUserNumber').value = user.number;
    document.getElementById('editUserForm').style.display = '';
    document.getElementById('addUserForm').style.display = 'none';
}

function deleteUser(number) {
    users = users.filter(u => u.number !== number);
    if (selectedUser === number) selectedUser = null;
    renderUsers();
    renderMessages();
}

function toggleBlockUser(number) {
    const user = users.find(u => u.number === number);
    if (user) user.blocked = !user.blocked;
    if (user.blocked && selectedUser === number) selectedUser = null;
    renderUsers();
    renderMessages();
}

const editUserForm = document.getElementById('editUserForm');
const editUserNameInput = document.getElementById('editUserName');
const editUserNumberInput = document.getElementById('editUserNumber');
const cancelEditBtn = document.getElementById('cancelEdit');
const showAddUserFormBtn = document.getElementById('showAddUserForm');

showAddUserFormBtn.onclick = function() {
    addUserForm.style.display = '';
    showAddUserFormBtn.style.display = 'none';
};

editUserForm.onsubmit = function(e) {
    e.preventDefault();
    const name = editUserNameInput.value.trim();
    const number = editUserNumberInput.value.trim();
    if (!number) return;
    const idx = users.findIndex(u => u.number === editingUserNumber);
    if (idx === -1) return;
    users[idx].name = name;
    users[idx].number = number;
    editingUserNumber = null;
    editUserForm.style.display = 'none';
    addUserForm.style.display = '';
    renderUsers();
    renderMessages();
};

cancelEditBtn.onclick = function() {
    editingUserNumber = null;
    editUserForm.style.display = 'none';
    addUserForm.style.display = 'none';
    showAddUserFormBtn.style.display = '';
};

addUserForm.onsubmit = function(e) {
    e.preventDefault();
    const name = userNameInput.value.trim();
    const number = userNumberInput.value.trim();
    if (!number) return;
    if (users.some(u => u.number === number)) return;
    users.push({ name, number, blocked: false });
    userNameInput.value = '';
    userNumberInput.value = '';
    renderUsers();
    addUserForm.style.display = 'none';
    showAddUserFormBtn.style.display = '';
};

sendForm.onsubmit = function(e) {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text || !selectedUser) return;
    const user = users.find(u => u.number === selectedUser);
    if (user && user.blocked) return;
    if (!messages[selectedUser]) messages[selectedUser] = [];
    messages[selectedUser].push({ text, fromMe: true, status: 'envoyé' });
    messageInput.value = '';
    renderMessages();
    // Simuler une réponse automatique
    setTimeout(() => {
        messages[selectedUser].push({ text: 'MANFORD, Réponse automatique', fromMe: false, status: 'réçu' });
        renderMessages();
    }, 700);
};

function sendFile(input, type) {
    if (!selectedUser || !input.files.length) return;
    const file = input.files[0];
    const url = URL.createObjectURL(file);
    if (!messages[selectedUser]) messages[selectedUser] = [];
    let msg = { fromMe: true, status: 'envoyé' };
    if (type === 'photo') {
        msg.photo = url;
    } else if (type === 'video') {
        msg.video = url;
    } else if (type === 'music') {
        msg.music = url;
    } else if (type === 'doc') {
        msg.doc = { url, name: file.name };
    } else if (type === 'audio') {
        msg.audio = url;
    }
    messages[selectedUser].push(msg);
    renderMessages();
    // Simuler une réponse automatique pour les fichiers
    setTimeout(() => {
        let autoMsg = { fromMe: false, status: 'réçu' };
        if (type === 'photo') {
            autoMsg.photo = url;
        } else if (type === 'video') {
            autoMsg.video = url;
        } else if (type === 'music') {
            autoMsg.music = url;
        } else if (type === 'doc') {
            autoMsg.doc = { url, name: file.name };
        } else if (type === 'audio') {
            autoMsg.audio = url;
        }
        messages[selectedUser].push(autoMsg);
        renderMessages();
    }, 700);
}

photoInput.onchange = () => sendFile(photoInput, 'photo');
videoInput.onchange = () => sendFile(videoInput, 'video');
musicInput.onchange = () => sendFile(musicInput, 'music');
docInput.onchange = () => sendFile(docInput, 'doc');
audioInput.onchange = () => sendFile(audioInput, 'audio');

const callBtn = document.getElementById('callBtn');
const videoCallBtn = document.getElementById('videoCallBtn');

callBtn.onclick = function() {
    if (!selectedUser) return alert('Sélectionnez un contact.');
    const user = users.find(u => u.number === selectedUser);
    if (!user || !user.online) return alert('Ce contact n’est pas en ligne.');
    alert('Appel vocal lancé avec ' + (user.name || user.number));
};
videoCallBtn.onclick = function() {
    if (!selectedUser) return alert('Sélectionnez un contact.');
    const user = users.find(u => u.number === selectedUser);
    if (!user || !user.online) return alert('Ce contact n’est pas en ligne.');
    alert('Appel vidéo lancé avec ' + (user.name || user.number));
};

window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('callBtn').style.display = 'none';
    document.getElementById('videoCallBtn').style.display = 'none';
});

const takePhotoBtn = document.getElementById('takePhotoBtn');

takePhotoBtn.onclick = function() {
    // Crée une modale temporaire pour la caméra
    const camModal = document.createElement('div');
    camModal.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.18);z-index:2000;display:flex;align-items:center;justify-content:center;';
    camModal.innerHTML = `<div style="background:white;padding:24px;border-radius:12px;box-shadow:0 2px 16px #0002;display:flex;flex-direction:column;align-items:center;gap:12px;">
        <video id="cameraStream" autoplay playsinline style="width:240px;height:180px;border-radius:8px;background:#222;"></video>
        <button id="capturePhotoBtn" style="background:#4f46e5;color:white;border:none;padding:8px 12px;border-radius:8px;">Capturer</button>
        <button id="closeCamModal" style="margin-top:8px;background:none;border:none;font-size:20px;cursor:pointer;">✖</button>
    </div>`;
    document.body.appendChild(camModal);
    const video = camModal.querySelector('#cameraStream');
    const captureBtn = camModal.querySelector('#capturePhotoBtn');
    const closeBtn = camModal.querySelector('#closeCamModal');
    let stream;
    navigator.mediaDevices.getUserMedia({ video: true }).then(s => {
        stream = s;
        video.srcObject = stream;
    });
    captureBtn.onclick = function() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        profilePhotoUrl = dataUrl;
        if (!document.getElementById('profilePreview')) {
            const img = document.createElement('img');
            img.id = 'profilePreview';
            img.src = dataUrl;
            img.style = 'width:64px;height:64px;border-radius:50%;object-fit:cover;margin-bottom:8px;align-self:center;';
            profileForm.insertBefore(img, profileForm.firstChild);
        } else {
            document.getElementById('profilePreview').src = dataUrl;
        }
        closeBtn.click();
    };
    closeBtn.onclick = function() {
        if (stream) stream.getTracks().forEach(t => t.stop());
        camModal.remove();
    };
};

const statusBtn = document.getElementById('statusBtn');
const statusModal = document.getElementById('statusModal');
const closeStatusBtn = document.getElementById('closeStatus');
const statusContent = document.getElementById('statusContent');
const addStatusBtn = document.getElementById('addStatusBtn');

let statuses = [];

statusBtn.onclick = function() {
    renderStatuses();
    statusModal.style.display = 'flex';
};
closeStatusBtn.onclick = function() {
    statusModal.style.display = 'none';
};
addStatusBtn.onclick = function() {
    // Ajout d'un statut (photo ou vidéo)
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.onchange = function() {
        if (input.files.length) {
            const file = input.files[0];
            const url = URL.createObjectURL(file);
            const type = file.type.startsWith('image') ? 'photo' : 'video';
            statuses.push({
                user: userProfile.name || userProfile.number,
                url,
                type,
                createdAt: Date.now()
            });
            renderStatuses();
            setTimeout(() => {
                // Supprime le statut après 23h
                statuses = statuses.filter(s => Date.now() - s.createdAt < 23 * 3600 * 1000);
                renderStatuses();
            }, 23 * 3600 * 1000);
        }
        input.remove();
    };
    input.click();
};

function renderStatuses() {
    statusContent.innerHTML = '';
    const now = Date.now();
    const visibleStatuses = statuses.filter(s => now - s.createdAt < 23 * 3600 * 1000);
    if (visibleStatuses.length === 0) {
        statusContent.innerHTML = '<div class="empty">Aucun statut disponible.</div>';
        return;
    }
    visibleStatuses.forEach(s => {
        const div = document.createElement('div');
        div.style = 'padding:8px 0;text-align:center;';
        div.innerHTML = `<strong>${s.user}</strong><br>`;
        if (s.type === 'photo') {
            div.innerHTML += `<img src="${s.url}" style="max-width:180px;border-radius:8px;">`;
        } else if (s.type === 'video') {
            div.innerHTML += `<video src="${s.url}" controls style="max-width:180px;border-radius:8px;"></video>`;
        }
        statusContent.appendChild(div);
    });
}

const myContactsBtn = document.getElementById('myContactsBtn');
const myContactsModal = document.getElementById('myContactsModal');
const closeMyContactsBtn = document.getElementById('closeMyContacts');
const myContactsList = document.getElementById('myContactsList');

myContactsBtn.onclick = function() {
    renderMyContactsList();
    myContactsModal.style.display = 'flex';
};
closeMyContactsBtn.onclick = function() {
    myContactsModal.style.display = 'none';
};

function renderMyContactsList() {
    myContactsList.innerHTML = '';
    if (users.length === 0) {
        myContactsList.innerHTML = '<div class="empty">Aucun contact enregistré.</div>';
        return;
    }
    users.forEach(user => {
        const div = document.createElement('div');
        div.className = 'user-item';
        let onlineDot = user.online ? '<span style="display:inline-block;width:10px;height:10px;background:#22c55e;border-radius:50%;margin-right:6px;vertical-align:middle;"></span>' : '';
        div.innerHTML = `${onlineDot}<span>${user.name || user.number}${user.blocked ? " <span style=\"color:red\">(bloqué)</span>" : ""}</span>`;
        div.style.cursor = user.blocked ? 'not-allowed' : 'pointer';
        div.onclick = () => {
            if (!user.blocked) {
                selectUser(user.number);
                myContactsModal.style.display = 'none';
            }
        };
        myContactsList.appendChild(div);
    });
}

// Météo
const weatherBtn = document.getElementById('weatherBtn');
const weatherModal = document.getElementById('weatherModal');
const closeWeatherBtn = document.getElementById('closeWeather');
const weatherContent = document.getElementById('weatherContent');
const weatherCityForm = document.getElementById('weatherCityForm');
const weatherCityInput = document.getElementById('weatherCity');

weatherBtn.onclick = function() {
    weatherContent.innerHTML = '';
    weatherCityInput.value = '';
    weatherModal.style.display = 'flex';
    fetchWeather('Kinshasa');
};
closeWeatherBtn.onclick = function() {
    weatherModal.style.display = 'none';
};
weatherCityForm.onsubmit = function(e) {
    e.preventDefault();
    const city = weatherCityInput.value.trim() || 'Kinshasa';
    fetchWeather(city);
};

async function fetchWeather(city) {
    weatherContent.innerHTML = '<div class="empty">Chargement météo...</div>';
    // Utilise Open-Meteo + Nominatim pour géocoder la ville
    try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
        const geoData = await geoRes.json();
        if (!geoData.length) {
            weatherContent.innerHTML = '<div class="empty">Ville non trouvée.</div>';
            return;
        }
        const lat = geoData[0].lat;
        const lon = geoData[0].lon;
        const meteoRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`);
        const meteo = await meteoRes.json();
        if (!meteo.daily) {
            weatherContent.innerHTML = '<div class="empty">Aucune donnée météo.</div>';
            return;
        }
        let html = `<div style='font-weight:bold;margin-bottom:8px;'>${city} (7 jours)</div>`;
        html += '<table style="border-collapse:collapse;width:100%;max-width:340px;">';
        html += '<tr><th style="padding:4px;">Jour</th><th style="padding:4px;">Min</th><th style="padding:4px;">Max</th><th style="padding:4px;">Pluie</th></tr>';
        for (let i = 0; i < meteo.daily.time.length; i++) {
            html += `<tr style="border-bottom:1px solid #eee;">
                <td style="padding:4px;">${meteo.daily.time[i]}</td>
                <td style="padding:4px;">${meteo.daily.temperature_2m_min[i]}°C</td>
                <td style="padding:4px;">${meteo.daily.temperature_2m_max[i]}°C</td>
                <td style="padding:4px;">${meteo.daily.precipitation_sum[i]} mm</td>
            </tr>`;
        }
        html += '</table>';
        weatherContent.innerHTML = html;
    } catch (e) {
        weatherContent.innerHTML = '<div class="empty">Erreur lors de la récupération météo.</div>';
    }
}

// Initial rendering
renderUsers();
renderMessages();
