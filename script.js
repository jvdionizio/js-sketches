const gallery = document.getElementById('gallery');

{/*<a
  href="../src/sketch-01.html"
  target="_blank"
  class="flex flex-col items-center justify-center w-1/4 h-fit p-6 relative">
      <img
        src="./output/01/sketch--01.png"
        alt="sketch--01"
        class="w-full border-[24px] border-stone-700"
      />
      <p class="self-start text-base font-fira-code absolute bottom-6 left-12 text-white">sketch-01</p>
</a>*/}

for (let i = 1; i <= 13; i++) {
  const a = document.createElement('a');
  a.href = `./sketches/sketch-${i.toString().padStart(2, '0')}.html`;
  a
    .classList
      .add(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'h-fit',
        'p-6',
        'relative',
        'sm:w-1/2',
        'xl:w-1/3',
        '2xl:w-1/4',
    );

  const img = document.createElement('img');
  img.src = `./output/${i.toString().padStart(2, '0')}/sketch--${i.toString().padStart(2, '0')}.png`;
  img.alt = `sketch--${i.toString().padStart(2, '0')}`;
  img.classList.add('w-full', 'border-[24px]', 'border-stone-700');

  const p = document.createElement('p');
  p.classList.add('self-start', 'text-base', 'font-fira-code', 'absolute', 'bottom-6', 'left-12', 'text-white');
  p.innerText = `sketch-${i.toString().padStart(2, '0')}`;
  
  a.appendChild(img);
  a.appendChild(p);
  gallery.appendChild(a);
}