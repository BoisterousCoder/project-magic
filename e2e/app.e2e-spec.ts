import { ProjectMagicPage } from './app.po';

describe('project-magic App', () => {
  let page: ProjectMagicPage;

  beforeEach(() => {
    page = new ProjectMagicPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
