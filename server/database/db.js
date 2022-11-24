const sqlite = require('sqlite3');

/* Retrieve the database */
const db = new sqlite.Database('database/riddles.sqlite', (err) => {
    if (err) {
        throw err;
    }
});

/* Start a database transaction */
function beginTransaction() {
    return new Promise((resolve, reject) => {
        db.run("BEGIN TRANSACTION", [], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/* Commit a database transaction */
function commitTransaction() {
    return new Promise((resolve, reject) => {
        db.run("COMMIT", [], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/* Rollback a database transaction */
function rollbackTransaction() {
    return new Promise((resolve, reject) => {
        db.run("ROLLBACK", [], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


module.exports = {
    db,
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
}