# Bangbo Liang's personal website

A personal academic homepage and journal, built with Jekyll and hosted on GitHub Pages. The original theme is [Beautiful Jekyll](https://github.com/daattali/beautiful-jekyll).

## Local preview

Use Ruby 3.1–3.3 and Bundler:

```sh
bundle install
bundle exec jekyll serve
```

Open http://localhost:4000. To check the production output, run `bundle exec jekyll build`.

If `_site/` has already been built, you can preview it without installing Ruby dependencies:

```sh
python3 -m http.server 4000 --bind 127.0.0.1 --directory _site
```

## Editing content

- Homepage sections: `_layouts/home.html`
- Navigation, metadata, and footer: `_layouts/personal.html`
- About page: `aboutme.md`
- Journal: add Markdown files to `_posts/` with the existing front matter format. The homepage, writing archive, tags, and RSS update automatically.
- Visual styles: `assets/css/personal.css`
- Mobile navigation, article search, and filters: `assets/js/personal.js`
- Site URL and settings: `_config.yml`

Existing article URLs and paginated archive URLs are retained. Search and filters run locally in the browser; articles remain accessible without JavaScript. The redesigned pages use local assets and system fonts.

Push changes to the repository's GitHub Pages publishing branch to update the live website through its existing deployment setup.
