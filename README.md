# AstroGuard V2 + NASA DONKI

Two terminals:

    npm install
    cp .env.example .env        # then put your NASA key in .env (NASA_API_KEY=...)
    npm run server              # terminal 1: Express API on http://localhost:3001
    npm run dev                 # terminal 2: Vite on http://localhost:5173 (proxies /api to the server)

Get a key at https://api.nasa.gov. The key is read only by the server from process.env.NASA_API_KEY.
Backend routes: /api/space-weather/{notifications,flares,cmes,sep,geomagnetic-storms,summary}?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Astronaut health data is simulated. Reference ranges are illustrative.
