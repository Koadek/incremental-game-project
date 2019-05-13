const body = document.querySelector('body');
const container = document.getElementById('container');
const score = document.getElementById('score');
const bank = document.getElementById('bank');
const coinsCollected = document.getElementById('coins-collected');
const assets = document.getElementById('assets');
const ressources = document.getElementById('ressources');
const achievements = document.getElementById('achievements');
const bonus = document.getElementById('bonus');
const btn = document.getElementById('fixed-btn');
btn.className = 'btn';
const sounds = {
  buy: new Audio('sounds/buy.mp3'),
  coin: new Audio('sounds/coin.mp3'),
};

const ressourceType = [
  { name: 'Miner', owned: 0, cps: 1, cost: 50, img: 'imgs/miner.jpeg' },
  { name: 'Computer', owned: 0, cps: 10, cost: 500, img: 'imgs/computer.png' },
  {
    name: 'Data center',
    owned: 0,
    cps: 100,
    cost: 2000,
    img: 'imgs/datacenter.png',
  },
  {
    name: 'Super computer',
    owned: 0,
    cps: 1000,
    cost: 50000,
    img: 'imgs/supercomputer.jpg',
  },
  {
    name: 'Quantum computer',
    owned: 0,
    cps: 10000,
    cost: 200000,
    img: 'imgs/quantumcomputer.jpg',
  },
  { name: 'AI', owned: 0, cps: 100000, cost: 5000000, img: 'imgs/AI.png' },
  {
    name: 'Matrioshka brain',
    owned: 0,
    cps: 1000000,
    cost: 20000000,
    img: 'imgs/matrioshka.jpg',
  },
  {
    name: 'Simulation',
    owned: 0,
    cps: 0,
    cost: 1000000000,
    img: 'imgs/simulation.jpg',
  },
];

const goal = [
  {
    message: 'Entrepreneur',
    isComplete: () => {
      return state.ressourceType[0].owned >= 5;
    },
    seen: false,
  },
  {
    message: 'from rags to riches',
    isComplete: () => {
      return state.coins >= 1000;
    },
    seen: false,
  },
  {
    message: 'Click madness',
    isComplete: () => {
      return state.click >= 100;
    },
    seen: false,
  },
  {
    message: 'Money rocket',
    isComplete: () => {
      return state.cps >= 10000;
    },
    seen: false,
  },
  {
    message: 'Singularity',
    isComplete: () => {
      return state.ressourceType[5].owned >= 1;
    },
    seen: false,
  },
  {
    message: 'Ready for simulation',
    isComplete: () => {
      return state.coins >= state.ressourceType[7].cost;
    },
    seen: false,
  },
];

function achievementCompleted(x) {
  if (state.goal[x].isComplete() === true && state.goal[x].seen === false) {
    alert(state.goal[x].message);
    state.goal[x].seen = true;
  }
}

let cps = 0;
let coins = 0;
let click = 0;

let state = {
  cps,
  coins,
  click,
  ressourceType,
  goal,
};

setInterval(() => {
  window.localStorage.setItem('state', JSON.stringify(state));
}, 10000);

// state = JSON.parse(window.localStorage.getItem('state'));

coinsCollected.innerHTML = state.coins;

btn.addEventListener('click', ev => {
  playSound('coin');
  const coinsToAdd = state.cps || 1;
  state.coins += coinsToAdd;
  state.click++;
  achievementCompleted(2);
  coinsCollected.innerHTML = Math.floor(state.coins);
  let plusCoin = document.createElement('div');
  plusCoin.className = 'plus-coin';
  plusCoin.innerHTML = '+ ' + coinsToAdd;
  plusCoin.style.top = ev.clientY + window.scrollY + 'px';
  plusCoin.style.left = ev.clientX + 'px';
  body.appendChild(plusCoin);
});

for (let i = 0; i < state.ressourceType.length; i++) {
  const ress = document.createElement('div');
  ress.style.display = 'none';
  ress.addEventListener('click', () => {
    buy(i);
  });
  ressources.appendChild(ress);

  const ressourceInfo = document.createElement('div');
  ressourceInfo.className = 'ressource-info';
  ress.appendChild(ressourceInfo);

  const icon = document.createElement('img');
  icon.src = state.ressourceType[i].img;
  icon.className = 'icon';
  ressourceInfo.appendChild(icon);

  const ressourceSpec = document.createElement('div');
  ressourceSpec.className = 'ressource-spec';
  ressourceInfo.appendChild(ressourceSpec);

  const ressourceName = document.createElement('div');
  ressourceName.innerHTML = state.ressourceType[i].name;
  ressourceSpec.appendChild(ressourceName);

  const ressourceCost = document.createElement('div');
  ressourceCost.innerHTML = state.ressourceType[i].cost;
  ressourceSpec.appendChild(ressourceCost);

  const smallCoin = document.createElement('img');
  smallCoin.src = 'imgs/coin.png';
  smallCoin.className = 'small-coin';
  ressourceCost.appendChild(smallCoin);

  const ressourceCount = document.createElement('div');
  ressourceCount.className = 'ressource-count';
  ressourceCount.innerHTML = state.ressourceType[i].owned;
  ress.appendChild(ressourceCount);

  state.ressourceType[i].element = ress;

  const assetType = document.createElement('div');
  assetType.style.display = 'none';
  assets.appendChild(assetType);

  state.ressourceType[i].assetElem = assetType;
}

setInterval(() => {
  state.coins += state.cps / 100;
  coinsCollected.innerHTML =
    Math.floor(Number(state.coins)) >= 1.0e9
      ? (Math.floor(Number(state.coins)) / 1.0e9).toFixed(2) + ' billion'
      : Math.floor(Number(state.coins)) >= 1.0e6
      ? (Math.floor(Number(state.coins)) / 1.0e6).toFixed(2) + ' million'
      : Math.floor(Number(state.coins));
  checkCoins();
}, 10);

// function randomBtn() {
//   const randomBtn = document.createElement('button');
//   randomBtn.className = 'btn';
//   randomBtn.style.top = Math.floor(Math.random() * 101) + '%';
//   randomBtn.style.left = Math.floor(Math.random() * 101) + '%';
//   bonus.appendChild(randomBtn);

//   const randomCoin = document.createElement('img');
//   randomCoin.src = 'imgs/coin.png';
//   randomCoin.className = 'coin';
//   randomBtn.appendChild(randomCoin);
// }

// setInterval(() => {
//   setTimeout(() => {
//     randomBtn();
//   }, Math.floor(Math.random() * 60001));
// }, 40000);

function checkCoins() {
  for (let i = 0; i < state.ressourceType.length; i++) {
    if (state.coins >= state.ressourceType[i].cost / 2) {
      show(state.ressourceType[i].element);
    }
    state.coins < state.ressourceType[i].cost
      ? (state.ressourceType[i].element.style.opacity = 0.5)
      : (state.ressourceType[i].element.style.opacity = 1);
  }
  state.coins > 1000000
    ? (score.style.background = "url('imgs/fallingcoins2.gif')")
    : state.coins > 100000
    ? (score.style.background = "url('imgs/fallingcoins1.gif')")
    : state.coins > 1000
    ? (score.style.background = "url('imgs/fallingcoins0.gif')")
    : (score.style.background = 'none');
  achievementCompleted(1);
  achievementCompleted(3);
  achievementCompleted(5);
}

function buy(x) {
  if (state.coins >= state.ressourceType[x].cost) {
    playSound('buy');
    state.coins -= state.ressourceType[x].cost;
    coinsCollected.innerHTML = Math.floor(state.coins);
    state.cps += state.ressourceType[x].cps;
    state.ressourceType[x].owned++;
    state.ressourceType[x].element.querySelector('.ressource-count').innerHTML =
      state.ressourceType[x].owned;
    show(state.ressourceType[x].assetElem);
    if (state.ressourceType[x].owned < 20) {
      const assetImg = document.createElement('img');
      assetImg.src = state.ressourceType[x].img;
      assetImg.className = 'icon';
      state.ressourceType[x].assetElem.appendChild(assetImg);
    }
  }
  achievementCompleted(0);
  achievementCompleted(4);
}

function playSound(sound) {
  sounds[sound].currentTime = 0;
  sounds[sound].play();
}

function show(element) {
  element.style.display = 'flex';
}
