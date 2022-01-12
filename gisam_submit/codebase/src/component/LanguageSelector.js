import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import React from 'react';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <Select
      labelId="demo-simple-select-label"
      color="secondary"
      id="demo-simple-select"
      value={i18n.language.slice(0, 2)}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      <MenuItem value="en">en</MenuItem>
      <MenuItem value="ar">ar</MenuItem>
      <MenuItem value="bn">bn</MenuItem>
      <MenuItem value="de">de</MenuItem>
      <MenuItem value="es">es</MenuItem>
      <MenuItem value="fr">fr</MenuItem>
      <MenuItem value="hi">hi</MenuItem>
      <MenuItem value="id">id</MenuItem>
      <MenuItem value="ja">ja</MenuItem>
      <MenuItem value="ko">ko</MenuItem>
      <MenuItem value="my">my</MenuItem>
      <MenuItem value="pt">pt</MenuItem>
      <MenuItem value="ru">ru</MenuItem>
      <MenuItem value="sw">sw</MenuItem>
      <MenuItem value="ta">ta</MenuItem>
      <MenuItem value="th">th</MenuItem>
      <MenuItem value="tl">tl</MenuItem>
      <MenuItem value="tr">tr</MenuItem>
      <MenuItem value="vi">vi</MenuItem>
      <MenuItem value="zh">zh-cn</MenuItem>
    </Select>
  );
}

export default LanguageSelector;
