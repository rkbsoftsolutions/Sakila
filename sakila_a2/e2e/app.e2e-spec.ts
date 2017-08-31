import { SakilaPage } from './app.po';

describe('sakila App', () => {
  let page: SakilaPage;

  beforeEach(() => {
    page = new SakilaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
