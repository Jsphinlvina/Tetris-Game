export class TetrisLib {
	constructor(canvas_id) {
		this.canvas = document.getElementById(canvas_id);
		this.context = this.canvas.getContext('2d');
		this.imageData = this.context.createImageData(
			this.canvas.width,
			this.canvas.height
		);

		this.blockTetris = [
			[[1, 1, 1, 1]], // persegi panjang
			[
				[1, 1],
				[1, 1],
			], // kotak
			[
				[1, 0],
				[1, 1],
			], // L
			[
				[0, 1, 0],
				[1, 1, 1],
			], // T
			[
				[1, 1, 0],
				[0, 1, 1],
			], // Z
			[
				[0, 1, 1],
				[1, 1, 0],
			], // S
			[
				[1, 0, 0],
				[1, 1, 1],
			], // L
			[
				[0, 0, 1],
				[1, 1, 1],
			], // J
		];

		this.papan = Array.from({ length: 20 }, () => Array(12).fill(0)); // code with gpt
		// cara simple membuat array 20x12 yang diisi 0 semua dengan javascript

		this.balokSaatIni = this.randomBalok();
		this.posisiBalokSaatIni = { x: 4, y: 0 };

		this.controlSaatIni = [];
		this.permainanPertama = true;
		this.acakController();
	}

	acakController() {
		let posisiAcak;
		const posisi = [
			{ x: 0, y: 0 },
			{ x: 80, y: 0 },
			{ x: 160, y: 0 },
			{ x: 240, y: 0 },
		];

		if (!this.permainanPertama) {
			posisiAcak = posisi.sort(() => Math.random() - 0.5);
		} else {
			posisiAcak = posisi;
			this.permainanPertama = false;
		}

		document.getElementById(
			'kiri'
		).style.transform = `translate(${posisiAcak[0].x}px, ${posisiAcak[0].y}px)`;
		document.getElementById(
			'kanan'
		).style.transform = `translate(${posisiAcak[1].x}px, ${posisiAcak[1].y}px)`;
		document.getElementById(
			'putar'
		).style.transform = `translate(${posisiAcak[2].x}px, ${posisiAcak[2].y}px)`;
		document.getElementById(
			'bawah'
		).style.transform = `translate(${posisiAcak[3].x}px, ${posisiAcak[3].y}px)`;
		
		this.controlSaatIni = posisiAcak.map((posisi, index) => ({
			key: index,
			x: posisi.x,
		}));
	}

	bersihkanSatuLine() {
		let barisDibersihkan = false;

		for (let y = this.papan.length - 1; y >= 0; y--) {
			let barisPenuh = true;

			for (let x = 0; x < this.papan[y].length; x++) {
				if (this.papan[y][x] !== 1) {
					barisPenuh = false;
					break;
				}
			}

			if (barisPenuh) {
				for (let k = y; k > 0; k--) {
					for (let x = 0; x < this.papan[k].length; x++) {
						this.papan[k][x] = this.papan[k - 1][x];
					}
				}

				// Isi baris teratas dengan 0
				// for (let x = 0; x < this.papan[0].length; x++) {
				// 	this.papan[0][x] = 0;
				// }

				barisDibersihkan = true;

				y++;
			}
		}

		if (barisDibersihkan) {
			this.acakController();
		}
	}

	randomBalok() {
		const randomIndex = Math.floor(Math.random() * this.blockTetris.length);
		return this.blockTetris[randomIndex];
	}

	putarBalok() {
		const balokSebelumnya = this.balokSaatIni;
		const balokDiputar = this.putarMatrix(this.balokSaatIni);
		this.balokSaatIni = balokDiputar;

		if (this.tabrakan()) {
			this.balokSaatIni = balokSebelumnya;
		}
	}

	// code with gpt
	// cara memutar matrix
	putarMatrix(matrix) {
		const baris = matrix.length;
		const kolom = matrix[0].length;
		const matrixDiputar = Array.from(
			{ length: kolom },
			() =>
				Array(baris).fill(0)
		);

		for (let y = 0; y < baris; y++) { 
			for (let x = 0; x < kolom; x++) { 
				matrixDiputar[x][baris - 1 - y] = matrix[y][x]; 
			}
		}
		return matrixDiputar;
	}

	tabrakan(piece = this.balokSaatIni) {
		for (let y = 0; y < piece.length; y++) {
			for (let x = 0; x < piece[y].length; x++) {
				if (
					piece[y][x] &&
					(this.papan[this.posisiBalokSaatIni.y + y] &&
						this.papan[this.posisiBalokSaatIni.y + y][
							this.posisiBalokSaatIni.x + x
						]) !== 0
				) {
					return true;
				}
			}
		}
		return false;
	}

	gambarTetrisBawah() {
		for (let y = 0; y < this.papan.length; y++) {
			for (let x = 0; x < this.papan[y].length; x++) {
				if (this.papan[y][x]) {
					this.gambarBalok(x, y, { r: 255, g: 255, b: 255 });
				}
			}
		}
	}

	gambarBalokAktif() {
		for (let y = 0; y < this.balokSaatIni.length; y++) {
			for (let x = 0; x < this.balokSaatIni[y].length; x++) {
				if (this.balokSaatIni[y][x]) {
					this.gambarBalok(
						this.posisiBalokSaatIni.x + x,
						this.posisiBalokSaatIni.y + y,
						{
							r: 255,
							g: 0,
							b: 0,
						}
					);
				}
			}
		}
	}

	gabungkan() {
		for (let y = 0; y < this.balokSaatIni.length; y++) {
			for (let x = 0; x < this.balokSaatIni[y].length; x++) {
				if (this.balokSaatIni[y][x]) {
					this.papan[this.posisiBalokSaatIni.y + y][
						this.posisiBalokSaatIni.x + x
					] = 1;
				}
			}
		}
		this.bersihkanSatuLine();
	}

	gambarBalok(x, y, color) {
		const startX = x * 20;
		const startY = y * 20;

		for (let i = 0; i < 20; i++) {
			for (let j = 0; j < 20; j++) {
				this.gambarTitik(startX + i, startY + j, color);
			}
		}
	}

	update() {
		this.posisiBalokSaatIni.y++;
		if (this.tabrakan()) {
			this.posisiBalokSaatIni.y--;
			this.gabungkan();
			this.balokSaatIni = this.randomBalok();
			this.posisiBalokSaatIni = { x: 4, y: 0 };
		}
		this.gambar();
	}

	gambar() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (let y = 0; y < this.imageData.height; y++) {
			for (let x = 0; x < this.imageData.width; x++) {
				this.gambarTitik(x, y, { r: 0, g: 0, b: 0 });
			}
		}

		this.gambarBalokAktif();
		this.gambarTetrisBawah();
		this.context.putImageData(this.imageData, 0, 0);
	}

	// drawGrid() {
	// 	const gridColor = { r: 100, g: 100, b: 100 };

	// 	for (let x = 0; x < this.canvas.width; x += 20) {
	// 		for (let y = 0; y < this.canvas.height; y++) {
	// 			this.gambarTitik(x, y, gridColor);
	// 		}
	// 	}

	// 	for (let y = 0; y < this.canvas.height; y += 20) {
	// 		for (let x = 0; x < this.canvas.width; x++) {
	// 			this.gambarTitik(x, y, gridColor);
	// 		}
	// 	}
	// }

	keKiri() {
		this.posisiBalokSaatIni.x--;
		if (this.tabrakan()) this.posisiBalokSaatIni.x++;
		this.gambar();
	}

	keKanan() {
		this.posisiBalokSaatIni.x++;
		if (this.tabrakan()) this.posisiBalokSaatIni.x--;
		this.gambar();
	}

	keBawah() {
		this.posisiBalokSaatIni.y += 5;
		if (this.tabrakan()) {
			this.posisiBalokSaatIni.y--;
			this.gabungkan();
			this.balokSaatIni = this.randomBalok();
			this.posisiBalokSaatIni = { x: 4, y: 0 };
		}
		this.gambar();
	}

	berputar() {
		this.putarBalok();
		this.gambar();
	}

	gambarTitik(x, y, color) {
		const index = (x + y * this.imageData.width) * 4;
		this.imageData.data[index] = color.r;
		this.imageData.data[index + 1] = color.g;
		this.imageData.data[index + 2] = color.b;
		this.imageData.data[index + 3] = 255;
	}
}
