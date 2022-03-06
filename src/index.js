import app from './app.js'
import { startConnection } from './database.js'

const main = async () => {
    startConnection();
    await app.listen(app.get('port'))
    console.log('server on port', app.get('port'));
}

main();