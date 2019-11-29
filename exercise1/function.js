const fs = require('fs');

// untuk menyimpan data kontak yang masuk blacklist
let blacklisted = [];

/**
 * inisialisasi data telepon yang masuk daftar hitam baru dari file teks
 *
 * Menggunakan cara yang tidak dapat diubah untuk menetapkan daftar hitam baru, sehingga fungsi ini dapat dipanggil beberapa kali
 * tidak hanya ketika server API dimulai
 *
 * @param blacklist
 */
function initialize(blacklist) {
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

        blacklisted = [...new_blacklist];
    });
}

/**
 * memeriksa blacklist menggunakan nama dan nomor telepon
 *
 * @param name
 * @param phone_number
 * @returns {boolean}
 */
function check_blacklist(name, phone_number) {
    const found = blacklisted.find((contact) => {
        return contact.name === name && contact.phone_number === phone_number;
    });

    return found !== undefined;
}