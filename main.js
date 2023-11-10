const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
  const tabButtons = tab.querySelectorAll(":scope > .tab-header > button");
  const tabContents = tab.querySelectorAll(":scope > .tab-content");
  tabButtons.forEach((tabButton) => {
    tabButton.addEventListener("click", () => {
      // Toggle between tab buttons
      tabButtons.forEach((button) => button.classList.remove("active"));
      tabButton.classList.add("active");

      // Toggle between tab contents
      const tabLabel = tabButton.getAttribute("data-tab");
      const tabContent = tab.querySelector(
        `.tab-content[data-tab="${tabLabel}"]`
      );
      tabContents.forEach((content) => content.classList.remove("active"));
      tabContent.classList.add("active");
    });
  });
});

const modalButtons = document.querySelectorAll(".modal-btn");
modalButtons.forEach((modalButton) => {
  modalButton.addEventListener("click", (e) => {
    e.stopPropagation();

    function hideModal() {
      modal.close();
      document.body.removeEventListener("click", hideModal);
      document.body.style.overflow = "auto";
    }

    const modalName = modalButton.getAttribute("data-modal");
    const modal = document.querySelector(`dialog[data-modal="${modalName}"]`);
    modal.showModal();
    modal
      .querySelector(".modal-container")
      .addEventListener("click", (e) => e.stopPropagation());

    document.body.style.overflow = "hidden";
    document.body.addEventListener("click", hideModal);
  });
});

const slides = document.querySelectorAll(".slides");
const slideInfo = [
  "User recieves 25% of total beans",
  "User recieves an Amazon gift card",
  "User recieves a Celebration theme",
];
slides.forEach((slider) => {
  const allSlides = [...slider.querySelectorAll(".slide")];
  const prevBtn = slider.querySelector(".slide-btn.prev");
  const nextBtn = slider.querySelector(".slide-btn.next");
  const slideInfoElement = slider.querySelector(".info");
  let currentId = parseInt(slider.getAttribute("data-current"));

  prevBtn.addEventListener("click", () => {
    const activeSlide = slider.querySelector(".slide.active");
    activeSlide.classList.remove("active");
    if (activeSlide.previousElementSibling.classList.contains("slide")) {
      activeSlide.previousElementSibling.classList.add("active");
      currentId -= 1;
    } else {
      allSlides[allSlides.length - 1].classList.add("active");
      currentId = allSlides.length - 1;
    }

    if (slideInfoElement) slideInfoElement.innerHTML = slideInfo[currentId];
    slider.setAttribute("data-current", currentId);
  });
  nextBtn.addEventListener("click", () => {
    const activeSlide = slider.querySelector(".slide.active");
    activeSlide.classList.remove("active");
    if (activeSlide.nextElementSibling.classList.contains("slide")) {
      activeSlide.nextElementSibling.classList.add("active");
      currentId += 1;
    } else {
      allSlides[0].classList.add("active");
      currentId = 0;
    }
    if (slideInfoElement) slideInfoElement.innerHTML = slideInfo[currentId];
    slider.setAttribute("data-current", currentId);
  });
});

async function renderScheduleData(scheduleData) {
  const danceScheduleTable = document.querySelector(".dance-container .table");
  const scheduleTableItemTemplate = document.querySelector("#table-desc");
  scheduleData = scheduleData.rows.slice(0, 5);
  scheduleData.forEach((schedule) => {
    const name = schedule.c[0].v;
    const id = schedule.c[1].v;
    const time = schedule.c[2].v;

    const scheduleTableItem = scheduleTableItemTemplate.content.cloneNode(true);
    const player1Name = scheduleTableItem.querySelector(".player-1-name");
    const player1ID = scheduleTableItem.querySelector(".player-1-id");
    const player2Name = scheduleTableItem.querySelector(".player-2-name");
    const player2ID = scheduleTableItem.querySelector(".player-2-id");
    const dateElement = scheduleTableItem.querySelector(".date");
    const timeElement = scheduleTableItem.querySelector(".time");

    player1Name.innerText = name;
    player1ID.innerText = "ID " + id;
    player2Name.innerText = name;
    player2ID.innerText = "ID " + id;
    dateElement.innerText = `${date.split("/")[0]}/${date.split("/")[1]}`;
    timeElement.innerText = time.split(" ")[0];

    danceScheduleTable.appendChild(scheduleTableItem);
  });
}

function renderLeaderboardData(data) {
  const top3 = data.rows.slice(0, 3);

  const toppers = document.querySelectorAll(".top");
  toppers.forEach((topper, i) => {
    const current = top3[i].c;
    const name = topper.querySelector(".name");
    const id = topper.querySelector(".id");
    const beans = topper.querySelector(".beans");

    name.innerHTML = current[0].v;
    id.innerHTML = current[1].v;
    beans.innerText = current[2].v || 0;
  });

  const winnerContainer = document.querySelector(".winner-container");
  const winnerStripTemplate = document.querySelector("#winner-strip");

  for (let i = 3; i < data.rows.length; i++) {
    const current = data.rows[i].c;
    const winnerStrip = winnerStripTemplate.content.cloneNode(true);
    const position = winnerStrip.querySelector(".position");
    position.innerHTML = i + 1;

    const name = winnerStrip.querySelector(".name");
    name.innerHTML = current[0].v;

    const id = winnerStrip.querySelector(".id");
    id.innerHTML = current[1].v;

    const beans = winnerStrip.querySelector(".beans");
    beans.innerHTML = current[2].v || 0;
    winnerContainer.appendChild(winnerStrip);
  }
}

async function init() {
  const data = await fetchSheetData(SHEET_RANGE);
  renderScheduleData(data.table);
  const leaderboardData = await fetchSheetData("A18:C27");
  renderLeaderboardData(leaderboardData.table);
}
init();
