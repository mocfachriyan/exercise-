const process = require('process');
const fs = require('fs');

/**
 * class Parking
 */
class ParkingLot {
    constructor() {
        // menginisialisasi penyimpanan data slot parkir
        this.slotsAvailable = [];
        this.slotsUsed = [];

        // menginisialisasi penyimpanan data tempat parkir
        this.cars = [];
    }

    /**
     * menginisialisasi slot yang tersedia
     *
     * @param args
     */
    create_parking_lot(args) {
        const number = parseInt(args[0]);
        const newSlots = [];
        for (let i = 1; i <= number; i++) {
            newSlots.push(i);
        }
        this.slotsAvailable = [...newSlots];
        console.log('Created a parking lot with ' + number + ' slots');
    }

    /**
     * parkir mobil
     *
     * shift slotsAvailable array dan memasukannya di slotsUsed
     * juga menyimpan data mobil ke car array
     *
     * @param args
     */
    park(args) {
        if (this.slotsAvailable.length !== 0) {
            const registration_number = args[0];
            const colour = args[1];

            const allocated = this.slotsAvailable.shift();
            this.slotsUsed.push(allocated);

            this.cars.push({
                slot_number: allocated,
                registration_number,
                colour
            });

            console.log('Allocated slot number: ' + allocated);
        } else {
            console.log('Sorry, parking lot is full');
        }
    }

    /**
     * mobil yang meninggalkan tempat parkir
     *
     * menghapus data mobil dari slotsUsed dan cars
     * dan memasukan slot_number kembali tersedia
     *
     * @param args
     */
    leave(args) {
        const slot_number = parseInt(args[0]);

        const slotIndex = this.slotsUsed.indexOf(args);
        if (slotIndex !== -1) {
            this.slotsUsed.splice(slotIndex, 1);
        } else {
            console.log('Not found');
        }

        const carIndex = this.cars.findIndex(car => car.slot_number === slot_number);
        if (carIndex !== -1) this.cars.splice(carIndex, 1);

        this.slotsAvailable.push(slot_number);
        this.slotsAvailable.sort();

        console.log('Slot number ' + slot_number + ' is free');
    }

    /**
     * tampil mobil
     *
     */
    status() {
        let status = 'Slot No.\t Registration No.\t Colour\n\r';
        this.cars.forEach(car => {
            status += car.slot_number + '\t\t ' + car.registration_number + '\t\t ' + car.colour + '\n\r';
        });
        console.log(status);
    }

    /**
     * mencari mobil berdasarkan spesifikasi
     *
     * @param field
     * @param retrieve
     * @param query
     */
    find_cars(field, retrieve, query) {
        const found = this.cars.filter(car => car[field] === query)
            .map(car => car[retrieve]);

        if (found.length !== 0) {
            console.log(found.join(', '));
        } else {
            console.log('Not found');
        }
    }
}

const parkingLot = new ParkingLot();

function processCommand(input) {
    const args = input.replace(/(\r\n|\n|\r)/gm, '').split(' ');

    const command = args.shift();
    switch (command) {
        case 'create_parking_lot':
            parkingLot.create_parking_lot(args);
            break;
        case 'park':
            parkingLot.park(args);
            break;
        case 'leave':
            parkingLot.leave(args);
            break;
        case 'status':
            parkingLot.status();
            break;
        case 'registration_numbers_for_cars_with_colour':
            parkingLot.find_cars('colour', 'registration_number', args[0]);
            break;
        case 'slot_numbers_for_cars_with_colour':
            parkingLot.find_cars('colour', 'slot_number', args[0]);
            break;
        case 'slot_number_for_registration_number':
            parkingLot.find_cars('registration_number', 'slot_number', args[0]);
            break;
        default:
            console.log('Command not found.');
            break;
    }
}

function start() {
    // argumen untuk mengambil file
    const filename = process.argv[2];
    if (filename) {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) throw err;

            data.split(/\r?\n/).forEach((args) => {
                processCommand(args);
            });
        });
    } else {
        // menginisialisasi stdin
        const stdinput = process.stdin;
        stdinput.setEncoding('utf-8');

        // membaca inputan argumen
        console.log('Input:');
        stdinput.on('data', data => {
            if (data === 'exit\n') {
                console.log("Parking Lot closed.");
                process.exit();
            } else {
                console.log("\n\rOutput:");

                processCommand(data);

                console.log('\n\rInput:');
            }
        });
    }
}

start();