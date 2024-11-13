import 'antd/dist/reset.css';

export interface ThemeType {
  background: string,
  baseColor: string,
  height: string,
  highlightColor: string,
  margin: string,
}

export const theme: ThemeType = {
  background: 'linear-gradient(180deg, #00000000 0%, #aadd6651 95%)',
  baseColor: '#ffffff',
  height: '48px',
  highlightColor: '#ffe7ba',
  margin: '12px',
};
