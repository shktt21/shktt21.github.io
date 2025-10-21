// Инициализация карты
const map = new maplibregl.Map({
    container: 'map',
    style: {
        "version": 8,
        "sources": {},
        "layers": []
    },
    center: [51, 0],
    zoom: 4
});

map.on('load', () => {
    // Добавляем слой фона первым
    map.addLayer({
        id: 'background',
        type: 'background',
        paint: {
            'background-color': 'lightblue'
        }
    });

    // Слой стран
    map.addSource('countries', {
        type: 'geojson',
        data: './data/countries.geojson',
        attribution: 'Natural Earth'
    });

    map.addLayer({
        id: 'countries-layer',
        type: 'fill',
        source: 'countries',
        paint: {
            'fill-color': ['match', ['get', 'MAPCOLOR7'], 1, 'yellow', 'lightgray']
        }
    });

    // Слой рек
    map.addSource('rivers', {
        type: 'geojson',
        data: './data/rivers.geojson'
    });

    map.addLayer({
        id: 'rivers-layer',
        type: 'line',
        source: 'rivers',
        paint: {
            'line-color': '#00BFFF'
        }
    });

    // Слой озер
    map.addSource('lakes', {
        type: 'geojson',
        data: './data/lakes.geojson'
    });

    map.addLayer({
        id: 'lakes-layer',
        type: 'fill',
        source: 'lakes',
        paint: {
            'fill-color': 'lightblue',
            'fill-outline-color': '#00BFFF'
        }
    });

    // Слой городов
    map.addSource('cities', {
        type: 'geojson',
        data: './data/cities.geojson'
    });

    // Добавляем обработчик загрузки данных
    map.on('sourcedata', 'cities', (event) => {
        if (event.type === 'load') {
            console.log('Данные городов загружены успешно');
        } else {
            console.error('Ошибка загрузки данных городов:', event);
        }
    });

    map.addLayer({
        id: 'cities-layer',
        type: 'circle',
        source: 'cities',
        paint: {
            'circle-color': 'rgb(123, 12, 234)',
            'circle-radius': 3
        }
    });

    map.on('click', 'cities-layer', (e) => {
        if (e.features && e.features.length > 0) {
            new maplibregl.Popup()
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML(e.features[0].properties.NAME)
                .addTo(map);
        }
    });

    // Обработчики курсора
    map.on('mouseenter', 'cities-layer', (e) => {
        if (e.features && e.features.length > 0) {
            map.getCanvas().style.cursor = 'pointer';
        }
    });

    map.on('mouseleave', 'cities-layer', () => {
        map.getCanvas().style.cursor = '';
    });
});
