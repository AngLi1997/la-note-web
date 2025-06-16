/**
 * 获取心情对应的表情和颜色
 * @param {string} mood 心情标签
 * @returns {{emoji: string, color: string}} 表情和颜色对象
 */
export const getMoodEmoji = (mood) => {
  const moods = {
    '开心': { emoji: '😄', color: '#4CAF50' },
    '难过': { emoji: '😢', color: '#2196F3' },
    '悲伤': { emoji: '😢', color: '#2196F3' },
    '平静': { emoji: '😌', color: '#607D8B' },
    '生气': { emoji: '😠', color: '#F44336' },
    '焦虑': { emoji: '😓', color: '#FF9800' },
    '无奈': { emoji: '😕', color: '#9C27B0' },
    '兴奋': { emoji: '🤩', color: '#FF5722' },
    '疲惫': { emoji: '😪', color: '#795548' },
    '感动': { emoji: '🥹', color: '#E91E63' },
    '思考': { emoji: '🤔', color: '#3F51B5' },
    '发呆': { emoji: '😶', color: '#9E9E9E' },
    '抓狂': { emoji: '😫', color: '#FF5252' },
    '崩溃': { emoji: '😱', color: '#D32F2F' },
    '摆烂': { emoji: '🫠', color: '#8D6E63' },
    'default': { emoji: '😊', color: '#607D8B' }
  }
  
  return moods[mood] || moods.default
} 