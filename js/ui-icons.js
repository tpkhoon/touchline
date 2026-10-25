// Drawn icons for the things the game names with a small picture: traits, the club's identity, facilities, training focuses,
// match shouts and prompts, the board's requests, promises, newspapers, agents. Each is a line drawing on a 24 by 24 grid that
// takes the colour of the text around it. The data files name an icon ('star', 'coins'); UI.ico draws it. A name with no drawing
// (or no name) draws nothing, so a screen never shows a stray word where a picture should be.
(function () {
  const FM = window.FM,
    UI = FM.UI;
  const P = {
    // money and the board
    coins:
      '<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    crane: '<path d="M5 21V6M5 6h14M5 10l5-4M19 6v6M3 21h8"/><path d="M16 12h6v4h-6z"/>',
    stadium:
      '<ellipse cx="12" cy="9" rx="9" ry="4.5"/><path d="M3 9v7c0 2.5 4 4.5 9 4.5s9-2 9-4.5V9M7.5 12.5v7M16.5 12.5v7"/>',
    trendDown: '<path d="M3 7l6 6 4-4 8 8M21 12v5h-5"/>',
    trendUp: '<path d="M3 17l6-6 4 4 8-8M21 12V7h-5"/>',
    hourglass: '<path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>',
    handshake: '<path d="M3 11l4-3h4l2 2 2-2h3l3 3-4 4-2-1-2 2-2-2-2 2-2-2z"/>',
    briefcase:
      '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
    scales: '<path d="M12 4v16M6 20h12M4 8h16M7 8l-3 6a3 3 0 0 0 6 0zM17 8l-3 6a3 3 0 0 0 6 0z"/>',
    pen: '<path d="M4 20l1-5L16 4l4 4L9 19zM14 6l4 4"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    door: '<path d="M6 21V4h12v17M3 21h18M15 12h.01"/>',
    // people, traits
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    bandage:
      '<rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M10 10.5h.01M14 10.5h.01M10 13.5h.01M14 13.5h.01"/>',
    heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
    medal: '<circle cx="12" cy="15" r="5"/><path d="M8.5 11.5L6 3h5l1 5 1-5h5l-2.5 8.5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>',
    flame: '<path d="M12 3c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z"/>',
    swords: '<path d="M5 3l8 8M3 5l3 3M19 3l-8 8M21 5l-3 3M11 11l-7 7M13 11l7 7M4 20l2-2M20 20l-2-2"/>',
    rain: '<path d="M6 14a4.5 4.5 0 0 1 .5-9 5.5 5.5 0 0 1 10.6 1.5A3.8 3.8 0 0 1 17 14z"/><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/>',
    sparkles:
      '<path d="M10 4l1.8 4.7 4.7 1.8-4.7 1.8L10 17l-1.8-4.7L3.5 10.5l4.7-1.8zM18 14l.9 2.1 2.1.9-2.1.9L18 20l-.9-2.1-2.1-.9 2.1-.9z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    snowflake: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 2 3-2M9 20l3-2 3 2"/>',
    bird: '<path d="M2 9c4 0 6 1 10 5 4-4 6-5 10-5-2 5-5 8-10 10C7 17 4 14 2 9z"/>',
    axe: '<path d="M6 20L16 6M13 5c3-2 6-1 8 1-1 3-4 4-7 3z"/>',
    turtle: '<path d="M3 15c0-5 4-8 9-8s9 3 9 8zM3 15h18M7 18v2M17 18v2M21 12l2-1"/>',
    trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 14v4M8 20h8"/>',
    worried:
      '<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M8.5 16c1.5-2 5.5-2 7 0M7.5 7l3 1M16.5 7l-3 1"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M8.5 14.5c2 2 5 2 7 0"/>',
    sleep: '<path d="M5 6h6l-6 7h6M13 12h5l-5 6h5"/>',
    shuffle: '<path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
    mentor:
      '<circle cx="9" cy="7" r="3"/><path d="M3 20v-2a5 5 0 0 1 5-5h2M17 12l1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z"/>',
    house: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M10 21v-6h4v6"/>',
    chair: '<path d="M7 3v10M7 13h10v8M7 13v8M7 17h10M7 8h6"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM8.5 12h7M8.5 16h5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    worker: '<circle cx="12" cy="9" r="3"/><path d="M5 21a7 7 0 0 1 14 0M8 7a4 4 0 0 1 8 0z"/>',
    puzzle:
      '<path d="M10 4a2 2 0 1 1 4 0v2h4v4h-2a2 2 0 1 0 0 4h2v4h-4v-2a2 2 0 1 0-4 0v2H6v-4h2a2 2 0 1 0 0-4H6V6h4z"/>',
    // clubs and places
    crown: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
    ladder: '<path d="M8 3v18M16 3v18M8 7h8M8 12h8M8 17h8"/>',
    peak: '<path d="M3 20l7-13 5 8 2-3 4 8z"/><path d="M10 7V3l4 1.5L10 6"/>',
    oil: '<ellipse cx="12" cy="6" rx="6" ry="2.5"/><path d="M6 6v12c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V6M6 12c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 9v6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    columns: '<path d="M3 9l9-5 9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 21h18"/>',
    scroll: '<path d="M6 3h12v15a3 3 0 0 0 3 3H9a3 3 0 0 1-3-3z"/><path d="M10 8h5M10 12h5"/>',
    ruins: '<path d="M4 21V11l5-4 3 3 3-5 5 5v11zM9 21v-5h6v5"/>',
    shark: '<path d="M3 19c6 0 11-3 11-15 3 3 5 7 5 11 0 2 1 3 2 4zM3 19c1 1 3 1 6 1"/>',
    train:
      '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 21l2-4M16 21l-2-4M9 14h.01M15 14h.01"/>',
    factory: '<path d="M3 21V10l6 4v-4l6 4V6h3v15zM3 21h18"/>',
    houses: '<path d="M3 20v-8l5-4 5 4v8M13 20V10l4-3 4 3v10M3 20h18M7 20v-5h2v5"/>',
    // the club's buildings and training
    dumbbell: '<path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12"/>',
    cross: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
    party: '<path d="M4 20l5-14 9 9zM14 4h.01M19 8h.01M17 3v2M21 12h-2"/>',
    chart: '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"/>',
    sprout: '<path d="M12 21v-9M12 12c0-4-3-6-7-6 0 4 3 6 7 6zM12 14c0-3 2.5-5 6-5 0 3-2.5 5-6 5z"/>',
    mountain: '<path d="M3 20l6-11 4 6 2.5-4L21 20z"/>',
    brain:
      '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
    plane: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>',
    runner: '<circle cx="15" cy="5" r="2"/><path d="M13 9l-3 3 3 3-1 5M10 12l-4 1M13 9l4 3 3-1M13 15l4 1"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    tophat: '<path d="M7 17V6h10v11M7 13h10M3 17h18"/>',
    flag: '<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>',
    bath: '<path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM6 12V6a2 2 0 0 1 4 0M7 20l-1 2M17 20l1 2"/>',
    glove:
      '<path d="M8 12V6a1.5 1.5 0 0 1 3 0v4V4a1.5 1.5 0 0 1 3 0v6V5a1.5 1.5 0 0 1 3 0v7a6 6 0 0 1-6 6 5 5 0 0 1-4-2L4 12.5a1.5 1.5 0 0 1 2.4-1.7L8 13"/>',
    // faces, signs and small things
    angry:
      '<circle cx="12" cy="12" r="9"/><path d="M9 11h.01M15 11h.01M7.5 8l3 1.5M16.5 8l-3 1.5M8.5 16.5c2-1.8 5-1.8 7 0"/>',
    grin: '<circle cx="12" cy="12" r="9"/><path d="M8.5 10h.01M15.5 10h.01M7.5 13.5h9c0 3-2 5-4.5 5s-4.5-2-4.5-5z"/>',
    neutral: '<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9 15.5h6"/>',
    unsure: '<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M8.5 16c2-1.2 4-1.2 7 0"/>',
    telescope: '<path d="M3 13l12-6 2 4-12 6zM15 7l3-1.5 1.5 3L17 11M8 21l3-6M13 21l-2-6"/>',
    note: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h5"/>',
    rocket:
      '<path d="M12 3c4 2 6 6 5 11l-3 3h-4l-3-3C6 9 8 5 12 3zM9 17l-3 3M15 17l3 3"/><circle cx="12" cy="10" r="1.6"/>',
    hole: '<ellipse cx="12" cy="14" rx="8" ry="4"/><ellipse cx="12" cy="13" rx="4.5" ry="1.8"/>',
    eyes: '<ellipse cx="7.5" cy="12" rx="4" ry="3"/><ellipse cx="16.5" cy="12" rx="4" ry="3"/><circle cx="7.5" cy="12" r="1"/><circle cx="16.5" cy="12" r="1"/>',
    bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
    batteryLow: '<rect x="2" y="8" width="17" height="9" rx="2"/><path d="M22 11v3M6 11v3"/>',
    repeat: '<path d="M4 11V9a3 3 0 0 1 3-3h12l-3-3M20 13v2a3 3 0 0 1-3 3H5l3 3"/>',
    yellowCard: '<rect x="7" y="3" width="10" height="18" rx="1.5" fill="#f2c744" stroke="none"/>',
    wind: '<path d="M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h7"/>',
    ball: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5l4 3-1.5 4.5h-5L8 10.5zM12 7.5V3M16 10.5l4-1.5M14.5 15l2 4M9.5 15l-2 4M8 10.5L4 9"/>',
    suitcase:
      '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M9 20v1M15 20v1"/>',
    shirt: '<path d="M8 4l-5 3 2 4 3-1v10h8V10l3 1 2-4-5-3a4 4 0 0 1-8 0z"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    people:
      '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 5a3.5 3.5 0 0 1 0 7M18 14a7 7 0 0 1 4 6"/>',
    stethoscope: '<path d="M6 3v6a4 4 0 0 0 8 0V3M10 13v3a4 4 0 0 0 8 0v-2"/><circle cx="18" cy="12" r="2"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/>',
    foot: '<path d="M8 3c3 0 4 3 4 6l7 3c2 1 2 4 0 5H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z"/>',
    boot: '<path d="M8 3c3 0 4 3 4 6l7 3c2 1 2 4 0 5H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z"/>',
    masks:
      '<path d="M3 5h11v7a5.5 5.5 0 0 1-11 0zM7 9h.01M11 9h.01M6.5 13c1.5 1.5 3.5 1.5 5 0M17 8h4v5a4 4 0 0 1-6 3.5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    clover:
      '<circle cx="9" cy="9" r="3.2"/><circle cx="15" cy="9" r="3.2"/><circle cx="9" cy="15" r="3.2"/><circle cx="15" cy="15" r="3.2"/>',
    stop: '<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8z"/><path d="M8 12h8"/>',
    magnet: '<path d="M5 3v8a7 7 0 0 0 14 0V3h-4v8a3 3 0 0 1-6 0V3zM5 7h4M15 7h4"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chat: '<path d="M4 5h16v11H11l-5 4v-4H4z"/><path d="M8 9h8M8 12h5"/>',
    dagger: '<path d="M12 2l3 9-3 3-3-3zM8 14h8M12 14v8"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    cloud: '<path d="M6 18a4.5 4.5 0 0 1 .5-9 5.5 5.5 0 0 1 10.6 1.5A3.8 3.8 0 0 1 17 18z"/>',
    thermometer: '<path d="M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0zM12 9v7"/>',
    // the match
    arrowUp: '<path d="M12 20V5M6 11l6-6 6 6"/>',
    wall: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 10h18M3 15h18M9 5v5M15 10v5M9 15v4"/>',
    fist: '<path d="M7 11V7a1.5 1.5 0 0 1 3 0v3-4a1.5 1.5 0 0 1 3 0v4-3a1.5 1.5 0 0 1 3 0v4-2a1.5 1.5 0 0 1 3 0v6a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-3l-2-4a1.5 1.5 0 0 1 2.5-1.5z"/>',
    clap: '<path d="M8 12l-3-3a1.5 1.5 0 0 1 2-2l3 3M10 14l-3-3M13 11l3-3a1.5 1.5 0 0 1 2 2l-5 5a5 5 0 0 1-7 0M4 3l1 2M20 3l-1 2M12 2v2"/>',
    finger:
      '<path d="M10 11V4a2 2 0 0 1 4 0v7M10 11h6a3 3 0 0 1 3 3v3a4 4 0 0 1-4 4h-3a4 4 0 0 1-3-1.5L6 15a1.5 1.5 0 0 1 2.2-2L10 14.5"/>',
    medical: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 7v10M7 12h10"/>',
    redCard: '<rect x="7" y="3" width="10" height="18" rx="1.5" fill="#e5484d" stroke="none"/>',
    stopwatch: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 3h6"/>',
    wave: '<path d="M2 9c3-3 5 3 8 0s5 3 8 0 3 3 4 2M2 16c3-3 5 3 8 0s5 3 8 0 3 3 4 2"/>',
    battery: '<rect x="2" y="8" width="17" height="9" rx="2"/><path d="M22 11v3M6 11v3M9.5 11v3M13 11v3"/>',
    speech: '<path d="M4 5h16v11H10l-5 4v-4H4z"/>',
    curve: '<path d="M4 19c0-9 6-14 15-14M14 3l5 2-2 5"/>',
    // the press
    newspaper: '<path d="M5 4h14v16H7a2 2 0 0 1-2-2zM8 8h8M8 12h8M8 16h5"/>',
    tv: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M10 3l2 3 2-3"/>',
    radio:
      '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8L17 3M8 14a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0M16 12h2M16 15h2"/>',
  };
  UI.ICONS = P;
  // The same drawing as a picture for a canvas (the story card to share): resolves to an Image in the colour given
  UI.icoImage = (name, color, size) =>
    new Promise((res) => {
      const d = P[name];
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => res(img);
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d || ''}</svg>`)}`;
    });
  // The drawing for an icon name, at the size of the text around it unless a size is given; '' when there is none
  UI.ico = (name, size) => {
    if (typeof name === 'string' && name.startsWith('<svg')) return name; // (already drawn)
    const d = P[name];
    // (no drawing: a plain symbol, an arrow or a tick, is shown as it is; an icon name with no drawing is not shown at all)
    if (!d) return typeof name === 'string' && name && !/^[A-Za-z]+$/.test(name) ? FM.U.esc(name) : '';
    const dim = size ? `width="${size}" height="${size}"` : 'width="1.15em" height="1.15em"';
    return `<svg class="ico" viewBox="0 0 24 24" ${dim} fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
  };
})();
