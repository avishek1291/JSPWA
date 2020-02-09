class PWAConfApp {
  constructor() {
    this.speakersDiv = document.querySelector('.speakers');
    this.scheduleDiv = document.querySelector('.schedule');
    this.init();
  }

  async init() {
    this.loadSpeakers();
    this.loadSchedule();
  }

  async loadSpeakers() {
    this.speakers = await this.fetchJSON('./speakers.json');

    this.speakersDiv.innerHTML = this.speakers
      .map(this.toSpeakerBlock)
      .join('\n');
  }

  async loadSchedule() {
    const rawSchedule = await this.fetchJSON('./schedule.json');

    // Add speaker details to array
    this.schedule = rawSchedule.map(this.addSpeakerDetails, this);
    this.scheduleDiv.innerHTML = this.schedule
      .map(this.toScheduleBlock)
      .join('\n');
  }

  toSpeakerBlock(speaker) {
    return `
        <div class="speaker">
          <img src="${speaker.picture}" alt="${speaker.name}">
          <div>${speaker.name}</div>
        </div>`;
  }

  toScheduleBlock(scheduleItem) {
    return `
      <div class="schedule-item ${scheduleItem.category}">
        <div class="title-and-time">
          <div class="time">${scheduleItem.startTime}</div>
          <div class="title-and-speaker">
            <div class="title">${scheduleItem.title}</div>
            <div class="speaker">${
              scheduleItem.speaker ? scheduleItem.speaker.name : '&nbsp;'
            }</div>
          </div>
        </div>
        <p class="description">${scheduleItem.description}</p>
      </div>
    `;
  }

  addSpeakerDetails(item) {
    if (item.speakerId) {
      return Object.assign({}, item, {
        speaker: this.speakers.find(s => s.id === item.speakerId)
      });
    }
    return Object.assign({}, item);
  }

  async fetchJSON(url) {
    const res = await fetch(url);
    return res.json();
  }

  async  registerSW(){
    if('serviceWorker' in navigator){
      try{
        await navigator.serviceWorker.register('./sw.js')
      }
      catch(e){
        alert('Sorry! service worker resgitration failed')
      }

    }
    else {
      document.querySelector('.alert').removeAttribute('hidden');
    }
  }
}
window.addEventListener('load', e => {
  new PWAConfApp().registerSW();
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
 
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
});