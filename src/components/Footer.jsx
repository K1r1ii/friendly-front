import React from 'react';

/**
 * Футер проекта со ссылками на разработчиков и названием компании
 * @param {{ developers: { name: string; url: string }[], companyName: string, year?: number }} props
 */
export default function Footer({ companyName, year = new Date().getFullYear() }) {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
      <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4 text-center mb-3 mb-md-0">
            <h5 className="mb-2">{companyName}</h5>
            <small>&copy; {year} {companyName}. All rights reserved.</small>
          </div>
        </div>
      </div>
    </footer>
  );
}
