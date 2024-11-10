import { server } from "./http"
import './websocket'


server.listen(3000, () => {
    console.log(`http://localhost:3000`)
})
