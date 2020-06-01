import 'antd/dist/antd.css';

const baseColor = '#FFFFFF';

export interface ThemeType {
  background: string,
  baseColor: string,
  height: string,
  highlightColor: string,
  margin: string,
  match: {
    won: {
      background: string,
      color: string,
    }
    draw: {
      background: string,
      color: string,
    }
    lost: {
      background: string,
      color: string,
    }
  }
}

export const theme: ThemeType = {
  background: 'linear-gradient(180deg, #00000000 0%, #aadd6651 95%)',
  baseColor: '#ffffff',
  height: '48px',
  highlightColor: '#ffe7ba',
  margin: '12px',
  match: {
    won: {
      background: '#fffb8f',
      color: '#787878',
    },
    draw: {
      background: `${baseColor}50`,
      color: '#787878',
    },
    lost: {
      background: `${baseColor}50`,
      color: '#787878',
    },
  },
};
