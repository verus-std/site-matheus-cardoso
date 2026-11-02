# Matheus Cardoso — site

Site estático (HTML, CSS e JS, sem build) do consultor imobiliário Matheus Cardoso, em Goiânia.

## Visualizar localmente

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Abra http://127.0.0.1:4173.

## Arquivos

- `index.html`: página inicial.
- `imovel.html`: página interna do imóvel (`imovel.html?id=<id do imóvel>`).
- `styles.css`: identidade visual. A escala de fontes (Epilogue e Inter Tight) fica nos tokens do `:root`.
- `properties.js`: imóveis, WhatsApp e Instagram. Para incluir ou editar um imóvel, altere este arquivo.
- `app.js`: catálogo, filtros, galeria, menu, acordeões e botão flutuante de WhatsApp.
- `assets/`: fotos. As fotos dos imóveis em `assets/imoveis/` vieram do Instagram @matheuscardoso.imoveis.

Valores e disponibilidade dos imóveis precisam ser confirmados com o Matheus.
