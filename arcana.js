(() => {
  const world = document.querySelector(".arcana-world");
  if (!world) return;
  const orders = {
    gold: { name: "Gold", sigil: "✦" },
    masks: { name: "Masks", sigil: "◐" },
    elements: { name: "Elements", sigil: "△" },
    dreams: { name: "Dreams", sigil: "◉" }
  };
  let chosen = localStorage.getItem("mariezal-arcana-order") || "none";
  let marks = 0;
  let audio;
  world.dataset.order = chosen;

  const one = selector => document.querySelector(selector);
  const all = selector => document.querySelectorAll(selector);

  for (let i = 0; i < 24; i++) {
    const ember = document.createElement("i");
    ember.style.setProperty("--i", i);
    one(".arcana-embers").appendChild(ember);
  }

  const go = scene => {
    world.dataset.scene = scene;
    all(".arcana-scene").forEach(panel => panel.classList.toggle("active", panel.dataset.panel === scene));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  all("[data-go]").forEach(button => button.addEventListener("click", () => go(button.dataset.go)));
  all("[data-order-choice]").forEach(button => button.addEventListener("click", () => {
    chosen = button.dataset.orderChoice;
    world.dataset.order = chosen;
    localStorage.setItem("mariezal-arcana-order", chosen);
    setTimeout(() => go("trial"), 380);
  }));

  const progress = one(".arcana-progress");
  for (let i = 0; i < 7; i++) progress.appendChild(document.createElement("i"));
  one(".arcana-canvas").addEventListener("click", event => {
    if (marks >= 7) return;
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const crack = document.createElement("span");
    crack.className = "arcana-crack";
    crack.style.left = `${(event.clientX - rect.left) / rect.width * 100}%`;
    crack.style.top = `${(event.clientY - rect.top) / rect.height * 100}%`;
    crack.style.width = `${55 + Math.random() * 75}px`;
    crack.style.transform = `rotate(${-55 + Math.random() * 110}deg)`;
    canvas.appendChild(crack);
    marks++;
    progress.children[marks - 1].classList.add("done");
    const whisper = one(".arcana-whisper");
    whisper.textContent = marks === 7 ? "Nothing broken here was ever wasted." : `${7 - marks} lines remain.`;
    if (marks === 7) {
      one(".arcana-finish").classList.add("visible");
      localStorage.setItem("mariezal-arcana-prologue", "complete");
    }
  });

  one(".arcana-finish").addEventListener("click", () => {
    const order = orders[chosen] || orders.gold;
    one(".arcana-chosen").textContent = order.sigil;
    one("[data-panel='ending'] h2 span").textContent = order.name;
  });

  one("[data-restart]").addEventListener("click", () => location.reload());
  one(".arcana-sound").addEventListener("click", async event => {
    if (audio) {
      await audio.close();
      audio = null;
      event.currentTarget.innerHTML = "<i>◌</i> Enter sound";
      return;
    }
    const Context = window.AudioContext || window.webkitAudioContext;
    audio = new Context();
    const master = audio.createGain();
    master.gain.value = .025;
    master.connect(audio.destination);
    [55, 82.41, 110].forEach((frequency, index) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = index === 1 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? .5 : .18;
      oscillator.connect(gain).connect(master);
      oscillator.start();
    });
    event.currentTarget.innerHTML = "<i class='playing'>◌</i> Sound on";
  });
})();
