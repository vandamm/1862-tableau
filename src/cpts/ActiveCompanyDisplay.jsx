import React from 'react'

import Card from './Card'
import COMPANIES from '../fn_core/companies'
import Company from './Company'

const ActiveCompanyDisplay = ({appState, pushNewState, showActions = true}) => {
  const deck = appState.deck
  const tableau_company_counts = appState.tableau_company_counts();

  return <Card title="Companies">
   {showActions &&
      <p className="text-left">
        <button className="btn btn-link" aria-label="Remove random company" onClick={(e) => {pushNewState(appState.with_updates({deck: deck.remove_random_company()}).filter_tableau())}}>
          <span aria-hidden="true" className="text-danger">&times;</span>
          {" "}
          Remove random company
        </button>
      </p>
    }
    <table className="table table-sm">
      <thead>
        <tr>
          <th>Name</th>
          <th>Deck</th>
          <th colspan="2">Tableau</th>
        </tr>
      </thead>
      <tbody>
        {COMPANIES.map(company => {
          const removed = appState.deck.removed_companies.includes(company);
          const active = deck.active_companies.includes(company);
          const canBeStarted = !active && tableau_company_counts[company] >= 3;

          let status;
          let actions;

          if (removed) {
            status = "(removed)"
          }
          else if (!showActions) {
            // No-op if we're not displaying actions
          } else if (active) {
            status = "(active)"
            actions = [
              <button className="btn btn-link py-0" aria-label={`Deactivate ${company}`} onClick={(e) => {
                const newDeck = deck.deactivate_company(company)
                const newState = appState.with_updates({deck: newDeck})
                pushNewState(newState)}}>
                <span aria-hidden="true" className="text-danger" title="Deactivate">&times;</span>
                <span className="d-none d-xl-inline">Deactivate</span>
            </button>
            ]
          } else {
            actions = [
              <button className="btn btn-link py-0" aria-label={`Remove ${company}`} onClick={(e) => {
                const newDeck = deck.remove_company(company)
                const newState = appState.with_updates({deck: newDeck}).filter_tableau()
                pushNewState(newState)
              }}>
                <span aria-hidden="true" className="text-danger" title="Remove">&times;</span>
                <span className="d-none d-xl-inline">Remove</span>
              </button>,
              <button className="btn btn-link py-0" aria-label={`Activate ${company}`} onClick={(e) => {pushNewState(appState.with_updates({deck: deck.activate_company(company)}))}}>
                <span aria-hidden="true" className="text-danger" title="Activate">&#10003;</span>
                <span className="d-none d-xl-inline">Activate</span>
              </button>
            ]
          }

          let className;

          if (canBeStarted) {
            className = "table-success"
          }

          return <tr>
            <td>
              <Company company={company} />
            </td>
            <td>
              <small>{deck.current_count(company) ?? 0}</small>
            </td>
            <td className={className}>
              <small>{tableau_company_counts[company] ?? 0}</small>
            </td>
            <td className="text-right">
              <small>{status}</small>
              {actions}
            </td>
          </tr>
        })}
      </tbody>
    </table>
    <p className="text-left">Cards in deck: {deck.total_count()}</p>
    {deck.overflow_pile.length > 0 &&
      <p className="text-left">Overflow cards: {deck.unremoved_overflow_pile().join(", ")}</p>
    }
  </Card>
}

export default ActiveCompanyDisplay
