const { Client } = require('pg');
const { francisDb } = require('../../config/dbConfig');

async function executeQuery(query) {
    try {
        const client = new Client({
            user: francisDb.user,
            host: francisDb.host,
            database: francisDb.database,
            password: francisDb.password,
            port: francisDb.port
        }); 
        await client.connect();
        console.log('Connected to PostgreSQL database!');

        if(client.connection){
            try {
                const res = await executeStatement(client, query);
                client.end();
                return res.rows;
            } catch (err) {
                console.log(err);
                client.end();
                throw (err);
            }
        }
    } catch (err) {
        console.log(err);
        throw (err);
    }
}

async function executeStatement(connection, statement) {
    if (connection) {
        return new Promise((resolve, reject) => {
            connection.query(statement).then(res => {
                console.log(`Successfully executed statement:  ${statement}`);
                resolve(res); 
                return res;
            }).catch(err => {
                console.error(`Failed to execute statement due to the following error: ${err.message}`);
                reject(err);
            });
        });
    }
}


exports.testConnection = async () => executeQuery('Select 1');

exports.executeSQL = (query) => executeQuery(query);
