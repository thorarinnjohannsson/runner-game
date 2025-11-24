// THEME SYSTEM - Visual themes for different levels

// Theme definitions
const THEMES = {
    grassland: {
        id: 'grassland',
        name: 'GRASSLAND ZONE',
        
        // Sky colors
        skyTop: '#5FB0E8',
        skyBottom: '#87CEEB',
        
        // Ground colors
        groundBase: '#694528',
        groundTop: '#6ABE30',
        groundDark: '#37946E',
        grassBorder: '#4D3222',
        
        // Soil texture
        soilLight: '#916643',
        soilDark: '#4D3222',
        
        // Obstacle colors
        obstacleMain: '#A0522D',
        obstacleDark: '#5D4037',
        obstacleLight: '#CD853F',
        obstacleFace: '#8B4513',
        
        // Floating platform colors
        platformMain: '#8D6E63',
        platformDark: '#5D4037',
        platformLight: '#A1887F',
        platformShadow: '#4E342E',
        
        // Parallax colors
        mountainColor: '#9EA7B8',
        mountainSnow: '#FFFFFF',
        hillColor: '#689F38',
        cloudColor: '#FFFFFF',
        cloudShadow: '#D3E0EA',
        bushColor: '#43A047',
        bushDark: '#2E7D32',
        
        // Special elements
        decorationType: 'bush'
    },
    
    desert: {
        id: 'desert',
        name: 'DESERT ZONE',
        
        // Sky colors - warm orange/yellow
        skyTop: '#FFA726',
        skyBottom: '#FFCC80',
        
        // Ground colors - sandy
        groundBase: '#D4A574',
        groundTop: '#F4A460',
        groundDark: '#CD853F',
        grassBorder: '#8B6914',
        
        // Soil texture
        soilLight: '#DEB887',
        soilDark: '#A0826D',
        
        // Obstacle colors - sandstone/adobe
        obstacleMain: '#DAA520',
        obstacleDark: '#B8860B',
        obstacleLight: '#F0E68C',
        obstacleFace: '#CD853F',
        
        // Floating platform colors
        platformMain: '#CD853F',
        platformDark: '#8B6914',
        platformLight: '#DEB887',
        platformShadow: '#654321',
        
        // Parallax colors
        mountainColor: '#D2691E',
        mountainSnow: '#FFE4B5',
        hillColor: '#DAA520',
        cloudColor: '#FFF8DC',
        cloudShadow: '#F5DEB3',
        bushColor: '#228B22', // Cacti green
        bushDark: '#006400',
        
        // Special elements
        decorationType: 'cactus'
    },
    
    night: {
        id: 'night',
        name: 'NIGHT ZONE',
        
        // Sky colors - dark blue/purple
        skyTop: '#1A237E',
        skyBottom: '#3F51B5',
        
        // Ground colors - dark
        groundBase: '#263238',
        groundTop: '#37474F',
        groundDark: '#1C2833',
        grassBorder: '#000000',
        
        // Soil texture
        soilLight: '#455A64',
        soilDark: '#263238',
        
        // Obstacle colors - dark with glow
        obstacleMain: '#424242',
        obstacleDark: '#212121',
        obstacleLight: '#616161',
        obstacleFace: '#37474F',
        
        // Floating platform colors
        platformMain: '#546E7A',
        platformDark: '#37474F',
        platformLight: '#78909C',
        platformShadow: '#263238',
        
        // Parallax colors
        mountainColor: '#37474F',
        mountainSnow: '#78909C',
        hillColor: '#455A64',
        cloudColor: '#90A4AE',
        cloudShadow: '#607D8B',
        bushColor: '#558B2F',
        bushDark: '#33691E',
        
        // Special elements
        decorationType: 'bush',
        isNight: true // Add stars, moon
    },
    
    ice: {
        id: 'ice',
        name: 'ICE ZONE',
        
        // Sky colors - cold blue
        skyTop: '#B3E5FC',
        skyBottom: '#E1F5FE',
        
        // Ground colors - icy
        groundBase: '#BBDEFB',
        groundTop: '#E3F2FD',
        groundDark: '#90CAF9',
        grassBorder: '#64B5F6',
        
        // Soil texture
        soilLight: '#E1F5FE',
        soilDark: '#B3E5FC',
        
        // Obstacle colors - ice blue
        obstacleMain: '#81D4FA',
        obstacleDark: '#4FC3F7',
        obstacleLight: '#B3E5FC',
        obstacleFace: '#4DD0E1',
        
        // Floating platform colors
        platformMain: '#B3E5FC',
        platformDark: '#81D4FA',
        platformLight: '#E1F5FE',
        platformShadow: '#4FC3F7',
        
        // Parallax colors
        mountainColor: '#ECEFF1',
        mountainSnow: '#FFFFFF',
        hillColor: '#CFD8DC',
        cloudColor: '#FFFFFF',
        cloudShadow: '#ECEFF1',
        bushColor: '#80CBC4',
        bushDark: '#4DB6AC',
        
        // Special elements
        decorationType: 'crystal'
    },
    
    volcano: {
        id: 'volcano',
        name: 'VOLCANO ZONE',
        
        // Sky colors - red/orange
        skyTop: '#D32F2F',
        skyBottom: '#FF5722',
        
        // Ground colors - volcanic
        groundBase: '#3E2723',
        groundTop: '#5D4037',
        groundDark: '#4E342E',
        grassBorder: '#1B0000',
        
        // Soil texture
        soilLight: '#6D4C41',
        soilDark: '#3E2723',
        
        // Obstacle colors - lava rock
        obstacleMain: '#424242',
        obstacleDark: '#212121',
        obstacleLight: '#757575',
        obstacleFace: '#616161',
        
        // Floating platform colors
        platformMain: '#795548',
        platformDark: '#5D4037',
        platformLight: '#8D6E63',
        platformShadow: '#3E2723',
        
        // Parallax colors
        mountainColor: '#424242',
        mountainSnow: '#FF6F00', // Lava glow
        hillColor: '#5D4037',
        cloudColor: '#757575',
        cloudShadow: '#424242',
        bushColor: '#F44336', // Lava pools
        bushDark: '#C62828',
        
        // Special elements
        decorationType: 'lava'
    },
    
    sky: {
        id: 'sky',
        name: 'SKY ZONE',
        
        // Sky colors - bright sky
        skyTop: '#4FC3F7',
        skyBottom: '#81D4FA',
        
        // Ground colors - clouds
        groundBase: '#E1F5FE',
        groundTop: '#FFFFFF',
        groundDark: '#B3E5FC',
        grassBorder: '#81D4FA',
        
        // Soil texture
        soilLight: '#FFFFFF',
        soilDark: '#E1F5FE',
        
        // Obstacle colors - cloud-like
        obstacleMain: '#EEEEEE',
        obstacleDark: '#BDBDBD',
        obstacleLight: '#FFFFFF',
        obstacleFace: '#E0E0E0',
        
        // Floating platform colors
        platformMain: '#FFF9C4',
        platformDark: '#FFF59D',
        platformLight: '#FFFDE7',
        platformShadow: '#FFF176',
        
        // Parallax colors
        mountainColor: '#E1F5FE',
        mountainSnow: '#FFFFFF',
        hillColor: '#B3E5FC',
        cloudColor: '#FFFFFF',
        cloudShadow: '#F5F5F5',
        bushColor: '#FFFFFF',
        bushDark: '#E0E0E0',
        
        // Special elements
        decorationType: 'cloud'
    }
};

// Theme cycle order
const THEME_ORDER = ['grassland', 'desert', 'night', 'ice', 'volcano', 'sky'];

// Get theme for a specific level
function getThemeForLevel(levelNum) {
    const index = (levelNum - 1) % THEME_ORDER.length;
    const themeId = THEME_ORDER[index];
    return THEMES[themeId];
}

// Current active theme
let currentTheme = THEMES.grassland;

// Apply theme to global variables (for backwards compatibility)
function applyTheme(theme) {
    currentTheme = theme;
    // Theme is now accessed through currentTheme global
    // Background, obstacles, etc will read from this
}

// Initialize with grassland theme
applyTheme(THEMES.grassland);

