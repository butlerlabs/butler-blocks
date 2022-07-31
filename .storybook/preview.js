import { addDecorator } from '@storybook/react';
import { StylesDecorator } from './stylesDecorator';

/**
 * This file is used by storybook in order to modify how stories
 * are rendered. Its primary purpose should be to add global paramaters
 * and any decorators that are needed.
 *
 * See here for more details:
 * https://medium.com/storybookjs/declarative-storybook-configuration-49912f77b78
 */
 addDecorator(StylesDecorator);