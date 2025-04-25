App({
  onLaunch: function() {
    // 小程序启动时执行的逻辑
    console.log('App launched');
    
    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res;
      }
    });
    
    // 尝试从本地存储获取上次使用的颜色设置
    try {
      const savedSettings = wx.getStorageSync('lightMoodSettings');
      if (savedSettings) {
        this.globalData.currentSettings = savedSettings;
      }
    } catch (e) {
      console.error('Failed to load saved settings:', e);
    }
  },
  
  globalData: {
    systemInfo: null,
    // 默认颜色设置 - 改为少女感预设
    currentSettings: {
      preset: 'pink',
      hue: 350,        // 0-360
      saturation: 100, // 0-100
      lightness: 80,  // 0-100
      brightness: 100 // 0-100 (屏幕亮度)
    },
    // 预设颜色配置
    presets: {
      'default': { name: '百搭光', hue: 0, saturation: 0, lightness: 100 }, // 白色
      'pink': { name: '少女感', hue: 350, saturation: 100, lightness: 80 },    // 粉色
      'purple': { name: '磨皮感', hue: 270, saturation: 100, lightness: 75 },  // 紫色
      'lightblue': { name: '冷白皮', hue: 195, saturation: 100, lightness: 85 }, // 浅蓝
      'yellow': { name: '小鸡黄', hue: 50, saturation: 100, lightness: 70 },    // 黄色
      'blue': { name: '清新光', hue: 220, saturation: 100, lightness: 70 }     // 蓝色
    }
  }
});