const fs = require('fs');

/**
 * Class BlackList untuk menginisialisasi dan menemukan kontak yang masuk blacklist
 */
class BlackList {
    /**
     * menginisialisasi penyimpanan data kontak yang dimasukkan dalam blacklist
     */
    constructor() {
        this.blacklisted = [];
    }

    /**
     * inisialisasi data telepon yang masuk blacklist baru dari file teks
     *
     * menggunakan cara yang tidak berubah untuk menetapkan blacklist baru, sehingga fungsi ini dapat dipanggil beberapa kali
     * tidak hanya ketika server API dimula
     *
     * @param blacklist
     */
    initialize(blacklist) {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) throw err;

            const new_blacklist = [];
            data.split(/\r?\n/).forEach((line) => {
                const contact = line.split(' ');

                new_blacklist.push({
                    name: contact[0],
                    phone_number: contact[1]
                })
            });

            this.blacklisted = [...new_blacklist];
        });
    }

    /**
     * memeriksa blcklist menggunakan nama dan nomor telepon
     *
     * @param name
     * @param phone_number
     * @returns {boolean}
     */
    check_blacklist(name, phone_number) {
        const found = this.blacklisted.find((contact) => {
            return contact.name === name && contact.phone_number === phone_number;
        });

        return found !== undefined;
    }
}