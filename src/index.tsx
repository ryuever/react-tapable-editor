import { HTMLAttributes, ReactChild } from 'react';
import PluginEditor from './PluginEditor';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactChild;
}

export default PluginEditor;
