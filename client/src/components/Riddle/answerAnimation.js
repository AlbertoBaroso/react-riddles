// Adaptation of https://codepen.io/Mamboleoo/pen/JjdXPgR

function pop(type) {
    let amount = 80;
    const bbox = document.getElementById("answer-submission").getBoundingClientRect();
    const x = bbox.left + bbox.width / 2;
    const y = bbox.top + bbox.height / 2;
    for (let i = 0; i < amount; i++)
        createParticle(x, y, type);
}

function createParticle(x, y, type) {
    let particle = document.createElement('particle');
    document.body.appendChild(particle);
    let width = Math.floor(Math.random() * 90 + 18);
    let height = width;
    let destinationX = (Math.random() - 0.5) * 600;
    let destinationY = (Math.random() - 0.5) * 600;
    let rotation = Math.random() * 520;
    let delay = Math.random() * 200;
    particle.style.fontSize = `${Math.random() * 34 + 10}px`;
    width = height = 'auto';

    if (type === "correct")
        particle.innerHTML = '✅';
    else
        particle.innerHTML = '❌';

    particle.style.width = `${width}px`;
    particle.style.height = `${height}px`;
    const animation = particle.animate([
        {
            transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(0deg)`,
            opacity: 1
        },
        {
            transform: `translate(-50%, -50%) translate(${x + destinationX}px, ${y + destinationY}px) rotate(${rotation}deg)`,
            opacity: 0
        }
    ], {
        duration: Math.random() * 1000 + 5000,
        easing: 'cubic-bezier(0, .9, .57, 1)',
        delay: delay
    });
    animation.onfinish = removeParticle;
}

function removeParticle(e) {
    e.srcElement.effect.target.remove();
}

export default pop;