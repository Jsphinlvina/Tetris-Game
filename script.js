import { TetrisLib } from './lib.js';

const tetris = new TetrisLib('tetris');

document
	.getElementById('kiri')
	.addEventListener('click', () => tetris.keKiri());
document
	.getElementById('kanan')
	.addEventListener('click', () => tetris.keKanan());
document
	.getElementById('putar')
	.addEventListener('click', () => tetris.berputar());
document
	.getElementById('bawah')
	.addEventListener('click', () => tetris.keBawah());

function hasilController(hasil) {
	switch (hasil) {
		case 0:
			tetris.keKiri();
			break;
		case 80:
			tetris.keKanan();
			break;
		case 160:
			tetris.berputar();
			break;
		case 240:
			tetris.keBawah();
			break;
	}
}

document.addEventListener('keydown', (event) => {
	switch (event.key) {
		case 'ArrowLeft':
			hasilController(tetris.controlSaatIni[0].x);
			break;
		case 'ArrowRight':
			hasilController(tetris.controlSaatIni[1].x);
			break;
		case 'ArrowUp':
			hasilController(tetris.controlSaatIni[2].x);
			break;
		case 'ArrowDown':
			hasilController(tetris.controlSaatIni[3].x);
			break;
	}
});

setInterval(() => tetris.update(), 1000);
