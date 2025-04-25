// index.js
const app = getApp();

Page({
  data: {
    // 颜色相关数据
    hue: 0,
    saturation: 100,
    lightness: 50,
    brightness: 100,
    currentPreset: 'default',
    presets: {},
    
    // UI控制
    panelVisible: true,
    canvasWidth: 0,
    canvasHeight: 0,
    
    // 当前颜色的RGB值
    currentColor: '#FFFFFF'
  },
  
  onLoad: function() {
    // 获取预设颜色
    const presets = app.globalData.presets;
    this.setData({ presets: presets });
    
    // 获取上次保存的设置
    const settings = app.globalData.currentSettings;
    this.setData({
      hue: settings.hue,
      saturation: settings.saturation,
      lightness: settings.lightness,
      brightness: settings.brightness,
      currentPreset: settings.preset
    });
    
    // 设置屏幕亮度
    this.setBrightness(settings.brightness);
    
    // 获取屏幕尺寸用于Canvas
    const systemInfo = app.globalData.systemInfo;
    this.setData({
      canvasWidth: systemInfo.windowWidth,
      canvasHeight: systemInfo.windowHeight
    });
    
    // 初始化颜色
    this.updateColor();
  },
  
  onShow: function() {
    // 页面显示时更新颜色
    this.updateColor();
  },
  
  // 更新颜色并绘制Canvas
  updateColor: function() {
    const { hue, saturation, lightness } = this.data;
    const rgbColor = this.hslToRgb(hue, saturation, lightness);
    const hexColor = this.rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);
    
    this.setData({ currentColor: hexColor });
    
    // 绘制Canvas
    const ctx = wx.createCanvasContext('colorCanvas');
    ctx.setFillStyle(hexColor);
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    ctx.draw();
    
    // 保存当前设置
    this.saveSettings();
  },
  
  // 保存设置到本地存储
  saveSettings: function() {
    const settings = {
      preset: this.data.currentPreset,
      hue: this.data.hue,
      saturation: this.data.saturation,
      lightness: this.data.lightness,
      brightness: this.data.brightness
    };
    
    app.globalData.currentSettings = settings;
    wx.setStorage({
      key: 'lightMoodSettings',
      data: settings
    });
  },
  
  // 设置屏幕亮度
  setBrightness: function(value) {
    wx.setScreenBrightness({
      value: value / 100,
      success: () => {
        console.log('亮度设置成功:', value);
      },
      fail: (err) => {
        console.error('亮度设置失败:', err);
      }
    });
  },
  
  // 切换控制面板显示/隐藏
  togglePanel: function() {
    this.setData({
      panelVisible: !this.data.panelVisible
    });
  },
  
  // 选择预设颜色
  selectPreset: function(e) {
    const preset = e.currentTarget.dataset.preset;
    const presetData = this.data.presets[preset];
    
    if (presetData) {
      this.setData({
        currentPreset: preset,
        hue: presetData.hue,
        saturation: presetData.saturation,
        lightness: presetData.lightness
      });
      
      this.updateColor();
    }
  },
  
  // 色相变化处理
  onHueChange: function(e) {
    this.setData({
      hue: e.detail.value,
      currentPreset: 'custom' // 切换到自定义模式
    });
    this.updateColor();
  },
  
  // 饱和度变化处理
  onSaturationChange: function(e) {
    this.setData({
      saturation: e.detail.value,
      currentPreset: 'custom' // 切换到自定义模式
    });
    this.updateColor();
  },
  
  // 亮度变化处理
  onLightnessChange: function(e) {
    this.setData({
      lightness: e.detail.value,
      currentPreset: 'custom' // 切换到自定义模式
    });
    this.updateColor();
  },
  
  // 屏幕亮度变化处理
  onBrightnessChange: function(e) {
    const brightness = e.detail.value;
    this.setData({ brightness: brightness });
    this.setBrightness(brightness);
    this.saveSettings();
  },
  
  // HSL转RGB颜色模型
  hslToRgb: function(h, s, l) {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // 灰色
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  },
  
  // RGB转十六进制颜色
  rgbToHex: function(r, g, b) {
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
});