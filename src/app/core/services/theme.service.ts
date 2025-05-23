import { OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { CoreConfig } from '../core.config';
import { Theme } from '../models/theme';
import { LayoutService } from './layout.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  themes = [new Theme('blue'), new Theme('teal'), new Theme('orange'), new Theme('purple')];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private rendererFactory: RendererFactory2,
    private overlayContainer: OverlayContainer,
    private layout: LayoutService,
    private config: CoreConfig
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    const theme = Object.assign(new Theme(), this.config.theme);
    this.updateTheme(theme);
  }

  setDarkMode(dark: boolean) {
    this.updateTheme(new Theme(this.config.theme.name, dark));
  }

  setTheme(name: string) {
    this.updateTheme(new Theme(name, this.config.theme.dark));
  }

  private updateTheme(theme: Theme) {
    this.renderer.removeClass(this.document.body, this.config.theme.class);
    this.renderer.addClass(this.document.body, theme.class);

    this.overlayContainer.getContainerElement().classList.replace(this.config.theme.class, theme.class);

    this.config.theme = theme;
    this.layout.saveConfig(this.config);
  }
}
