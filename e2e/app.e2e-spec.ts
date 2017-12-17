import { LeafFrontPage } from './app.po';

describe('leaf-front App', () => {
  let page: LeafFrontPage;

  beforeEach(() => {
    page = new LeafFrontPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
