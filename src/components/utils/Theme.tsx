import 'antd/dist/antd.css';

const baseColor = '#FFFFFF';

export interface ThemeType {
  background: string,
  baseColor: string,
  bodyBackground: string,
  headerBackground: string,
  height: string,
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
  background: 'linear-gradient(0deg, #00000000 0%, #aadd6650 100%)',
  baseColor,
  bodyBackground: 'white',
  headerBackground: '#ffe7ba',
  height: '48px',
  match: {
    won: {
      background: 'khaki',
      color: '#787878',
    },
    draw: {
      background: 'transparent',
      color: '#787878',
    },
    lost: {
      background: `${baseColor}50`,
      color: '#787878',
    },
  },
};
