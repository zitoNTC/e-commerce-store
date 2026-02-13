export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section className="footer-block">
          <h3>Contato</h3>
          <p>Email: contato@eaarth.com</p>
          <p>Telefone: +55 (00) 00000-0000</p>
          <p>Localizacao: Cidade, Estado, Pais</p>
        </section>
        <section className="footer-block">
          <h3>Informacoes</h3>
          <p>Horario: Seg-Sex, 09:00-18:00</p>
          <p>Envio para todo o pais</p>
          <p>Suporte em ate 24h</p>
        </section>
        <section className="footer-block">
          <h3>Redes Sociais</h3>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
          <a href="#">LinkedIn</a>
          <a href="#">YouTube</a>
        </section>
      </div>
      <div className="footer-bottom">
        <p>2026 EAARTH. All rights reserved.</p>
      </div>
    </footer>
  );
}
