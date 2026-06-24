// App JS: moves behavior from inline <script> in index.html
document.getElementById('year').textContent = new Date().getFullYear();
(function(){
  const tempEl = document.getElementById('weather-temp');
  const condEl = document.getElementById('weather-cond');
  const emojiEl = document.getElementById('weather-emoji');
  const locEl = document.getElementById('weather-location');

  function mapCode(code){
    if(code === 0) return ['Sunny','☀️'];
    if([1,2].includes(code)) return ['Partly cloudy','🌤️'];
    if(code === 3) return ['Overcast','☁️'];
    if([45,48].includes(code)) return ['Fog','🌫️'];
    if([51,53,55,56,57].includes(code)) return ['Drizzle','🌦️'];
    if([61,63,65,66,67,80,81,82].includes(code)) return ['Rain','🌧️'];
    if([71,73,75,77,85,86].includes(code)) return ['Snow','❄️'];
    if([95,96,99].includes(code)) return ['Thunderstorm','⛈️'];
    return ['Unknown','🌈'];
  }

  function showError(msg){ tempEl.textContent='—'; condEl.textContent=msg; emojiEl.textContent='❓'; locEl.textContent=''; }

  if(!navigator.geolocation){ showError('Geolocation unavailable'); return }

  navigator.geolocation.getCurrentPosition(async (pos)=>{
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    locEl.textContent = `Lat ${lat.toFixed(2)}, Lon ${lon.toFixed(2)}`;
    try{
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`;
      const res = await fetch(url);
      if(!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      if(!data.current_weather) throw new Error('No current weather');
      const cw = data.current_weather;
      const temp = Math.round(cw.temperature);
      const code = cw.weathercode;
      const [label,emoji] = mapCode(code);
      tempEl.textContent = `${temp}°F`;
      condEl.textContent = label;
      emojiEl.textContent = emoji;
    }catch(err){ showError('Weather unavailable') }
  }, (err)=>{
    if(err && err.code===1) showError('Please enable location to see your weather'); else showError('Location error');
  }, {timeout:10000});
})();
