import { useEffect, useState } from 'react'
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Eye,
  EyeOff,
  Landmark,
  LogOut,
  Plus,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import './App.css'

const API_BASE = '/api'

async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const text = await response.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { message: 'The server returned an unexpected response.' }
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.')
  }
  return data
}

function formatMoney(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

function App() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('blueledger-session'))
    } catch {
      return null
    }
  })
  const [accounts, setAccounts] = useState([])
  const [balances, setBalances] = useState({})
  const [activity, setActivity] = useState([])
  const [activeView, setActiveView] = useState('Overview')
  const [loading, setLoading] = useState(Boolean(session?.token))
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [showBalance, setShowBalance] = useState(true)
  const [authMode, setAuthMode] = useState('login')
  const [authBusy, setAuthBusy] = useState(false)
  const [accountBusy, setAccountBusy] = useState(false)
  const [transferBusy, setTransferBusy] = useState(false)
  const [transfer, setTransfer] = useState({ fromAccount: '', toAccount: '', amount: '' })

  async function refreshAccounts(token = session?.token) {
    if (!token) return
    const result = await request('/accounts', { token })
    const loadedAccounts = result.accounts || []
    setAccounts(loadedAccounts)
    setTransfer((current) => ({
      ...current,
      fromAccount: loadedAccounts.some((account) => account._id === current.fromAccount)
        ? current.fromAccount
        : loadedAccounts[0]?._id || '',
    }))

    const balanceResults = await Promise.allSettled(
      loadedAccounts.map(async (account) => {
        const result = await request(`/accounts/balance/${account._id}`, { token })
        return [account._id, result.balance]
      }),
    )
    setBalances(Object.fromEntries(balanceResults
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)))
  }

  useEffect(() => {
    if (!session?.token) return

    let mounted = true
    request('/accounts', { token: session.token })
      .then(async (result) => {
        const loadedAccounts = result.accounts || []
        const balanceResults = await Promise.allSettled(
          loadedAccounts.map(async (account) => {
            const balance = await request(`/accounts/balance/${account._id}`, { token: session.token })
            return [account._id, balance.balance]
          }),
        )
        if (!mounted) return
        setAccounts(loadedAccounts)
        setBalances(Object.fromEntries(balanceResults
          .filter((balance) => balance.status === 'fulfilled')
          .map((balance) => balance.value)))
        setTransfer((current) => ({
          ...current,
          fromAccount: current.fromAccount || loadedAccounts[0]?._id || '',
        }))
      })
      .catch((requestError) => {
        if (mounted) {
          setError(requestError.message)
          if (/token|unauthorized/i.test(requestError.message)) {
            localStorage.removeItem('blueledger-session')
            setSession(null)
          }
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => { mounted = false }
  }, [session?.token])

  function saveSession(nextSession) {
    localStorage.setItem('blueledger-session', JSON.stringify(nextSession))
    setSession(nextSession)
    setLoading(true)
    setError('')
    setNotice('')
  }

  function signOut() {
    const token = session?.token
    if (token) request('/auth/logout', { method: 'POST', token }).catch(() => { })
    localStorage.removeItem('blueledger-session')
    setSession(null)
    setLoading(false)
    setAccounts([])
    setBalances({})
    setActivity([])
  }

  async function submitAuth(event) {
    event.preventDefault()
    setAuthBusy(true)
    setError('')
    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries())
    try {
      const result = await request(`/auth/${authMode === 'login' ? 'login' : 'register'}`, {
        method: 'POST',
        body: payload,
      })
      saveSession({ token: result.token, user: result.user })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setAuthBusy(false)
    }
  }

  async function createAccount() {
    setAccountBusy(true)
    setError('')
    try {
      await request('/accounts', { method: 'POST', token: session.token, body: { currency: 'INR' } })
      await refreshAccounts()
      setNotice('Your account is ready.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setAccountBusy(false)
    }
  }

  async function submitTransfer(event) {
    event.preventDefault()
    setTransferBusy(true)
    setError('')
    setNotice('')
    try {
      const result = await request('/transactions', {
        method: 'POST',
        token: session.token,
        body: {
          ...transfer,
          amount: Number(transfer.amount),
          idempotencyKey: crypto.randomUUID(),
        },
      })
      setActivity((current) => [{
        id: result.transaction?._id || crypto.randomUUID(),
        amount: Number(transfer.amount),
        toAccount: transfer.toAccount,
        date: new Date(),
        status: 'Completed',
      }, ...current])
      setTransfer((current) => ({ ...current, toAccount: '', amount: '' }))
      await refreshAccounts()
      setNotice('Transfer completed successfully.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setTransferBusy(false)
    }
  }

  const totalBalance = accounts.reduce((total, account) => total + (balances[account._id] || 0), 0)

  if (!session?.token) {
    return (
      <main className="auth-layout">
        <section className="auth-brand-panel">
          <a className="brand brand-light" href="#top" aria-label="Blueledger home">
            <span className="brand-mark"><Landmark size={19} strokeWidth={2.3} /></span>
            <span>blueledger</span>
          </a>
          <div className="auth-message">
            <span className="eyebrow eyebrow-light">BANKING, MADE CLEAR</span>
            <h1>Your money<br />All in one place.</h1>
            <p>A quieter way to keep track of your accounts and move money when you need to.</p>
          </div>
          <div className="auth-panel-footer"><ShieldCheck size={17} /> Secure access to your account</div>
        </section>
        <section className="auth-form-side">
          <div className="mobile-brand">
            <a className="brand" href="#top"><span className="brand-mark"><Landmark size={19} /></span><span>blueledger</span></a>
          </div>
          <form className="auth-form" onSubmit={submitAuth}>
            <span className="eyebrow">YOUR PERSONAL BANKING SPACE</span>
            <h2>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <p className="auth-intro">{authMode === 'login' ? 'Sign in to see what’s happening with your money.' : 'A few details and you’re ready to get started.'}</p>
            {authMode === 'register' && (
              <label className="field-label">Full name<input name="name" type="text" placeholder="Alex Morgan" autoComplete="name" required /></label>
            )}
            <label className="field-label">Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
            <label className="field-label">Password<input name="password" type="password" placeholder="At least 6 characters" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} minLength="6" required /></label>
            {error && <p className="form-alert" role="alert">{error}</p>}
            <button className="primary-button auth-submit" type="submit" disabled={authBusy}>
              {authBusy ? 'Please wait…' : authMode === 'login' ? 'Sign in' : 'Create account'}
              {!authBusy && <ArrowRight size={17} />}
            </button>
            <p className="auth-switch">
              {authMode === 'login' ? 'New to Blueledger?' : 'Already have an account?'}{' '}
              <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError('') }}>
                {authMode === 'login' ? 'Create an account' : 'Sign in'}
              </button>
            </p>
          </form>
          <p className="auth-legal">By continuing, you agree to keep your sign-in details private.</p>
        </section>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" onClick={() => setActiveView('Overview')}>
          <span className="brand-mark"><Landmark size={19} strokeWidth={2.3} /></span>
          <span>blueledger</span>
        </a>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {[
            { label: 'Overview', icon: Wallet },
            { label: 'Accounts', icon: CreditCard },
            { label: 'Send money', icon: ArrowLeftRight },
          ].map(({ label, icon: Icon }) => (
            <button className={`nav-item ${activeView === label ? 'active' : ''}`} key={label} onClick={() => setActiveView(label)}>
              <Icon size={18} strokeWidth={1.9} /><span>{label}</span>
              {label === 'Accounts' && accounts.length > 0 && <span className="nav-count">{accounts.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-link"><CircleHelp size={18} /><span>Need a hand?</span><ArrowRight size={15} /></div>
          <div className="profile-row">
            <div className="avatar">{session.user?.name?.trim()?.[0]?.toUpperCase() || 'U'}</div>
            <div className="profile-copy"><strong>{session.user?.name || 'Your account'}</strong><span>Personal account</span></div>
            <button className="icon-button profile-exit" onClick={signOut} aria-label="Sign out" title="Sign out"><LogOut size={17} /></button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>My banking</span><span className="breadcrumb-divider">/</span><strong>{activeView}</strong></div>
          <div className="topbar-actions">
            <span className="secure-indicator"><ShieldCheck size={15} /> Secure session</span>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button>
            <button className="mobile-signout" onClick={signOut} aria-label="Sign out"><LogOut size={17} /></button>
          </div>
        </header>

        <div className="page-content" key={activeView}>
          <div className="page-heading">
            <div>
              <span className="eyebrow">{new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()).toUpperCase()}</span>
              <h1>{activeView === 'Overview' ? `Good day, ${session.user?.name?.split(' ')[0] || 'there'}` : activeView}</h1>
              <p>{activeView === 'Overview' ? 'Here’s a clear look at your money today.' : activeView === 'Accounts' ? 'Your accounts and their current balances.' : 'Move money to another Blueledger account.'}</p>
            </div>
            <button className="help-button" onClick={() => setNotice('For account support, contact your banking administrator.')}><CircleHelp size={16} /> Help</button>
          </div>

          {error && <div className="notice notice-error" role="alert"><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}
          {notice && <div className="notice notice-success" role="status"><Check size={16} /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}

          {loading ? (
            <div className="loading-panel"><span className="loading-spinner" />Loading your accounts…</div>
          ) : activeView === 'Accounts' ? (
            <section className="accounts-view view-enter">
              <div className="section-title-row"><div><h2>Your accounts</h2><p>Balances are calculated from your ledger activity.</p></div>{accounts.length === 0 && <button className="primary-button compact-button" onClick={createAccount} disabled={accountBusy}>{accountBusy ? 'Opening…' : <><Plus size={16} /> Open account</>}</button>}</div>
              {accounts.length === 0 ? <EmptyState onCreate={createAccount} busy={accountBusy} /> : (
                <div className="account-list">{accounts.map((account, index) => <AccountRow key={account._id} account={account} balance={balances[account._id]} index={index} />)}</div>
              )}
              <div className="account-note"><ShieldCheck size={17} /><p>Your account details are only visible to you after signing in.</p></div>
            </section>
          ) : activeView === 'Send money' ? (
            <div className="transfer-page view-enter"><TransferForm accounts={accounts} balances={balances} transfer={transfer} setTransfer={setTransfer} onSubmit={submitTransfer} busy={transferBusy} /></div>
          ) : (
            <>
              <section className="summary-grid" aria-label="Account summary">
                <article className="balance-card">
                  <div className="balance-card-top"><span>AVAILABLE BALANCE</span><button onClick={() => setShowBalance((shown) => !shown)} aria-label={showBalance ? 'Hide balance' : 'Show balance'}>{showBalance ? <Eye size={17} /> : <EyeOff size={17} />}</button></div>
                  <div className="balance-amount">{showBalance ? formatMoney(totalBalance) : '••••••••'}</div>
                  <div className="balance-card-foot"><span><i /> All accounts combined</span><span>{accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}</span></div>
                  <div className="balance-watermark" aria-hidden="true"><Landmark size={112} strokeWidth={0.75} /></div>
                </article>
                <article className="summary-card">
                  <div className="summary-card-label"><span className="summary-icon"><CreditCard size={17} /></span><span>ACCOUNTS</span></div>
                  <strong>{accounts.length.toString().padStart(2, '0')}</strong>
                  <span className="summary-caption">{accounts.length ? 'Active personal account' : 'No account opened yet'}</span>
                </article>
                <article className="summary-card transfer-summary">
                  <div className="summary-card-label"><span className="summary-icon"><ArrowUpRight size={17} /></span><span>QUICK ACTION</span></div>
                  <strong className="summary-action-title">Send money</strong>
                  <button className="text-link" onClick={() => setActiveView('Send money')}>Make a transfer <ArrowRight size={15} /></button>
                </article>
              </section>

              {accounts.length === 0 ? (
                <EmptyState onCreate={createAccount} busy={accountBusy} />
              ) : (
                <section className="dashboard-grid">
                  <div className="accounts-panel">
                    <div className="section-title-row"><div><h2>Your accounts</h2><p>Balances and account status</p></div><button className="text-link" onClick={() => setActiveView('Accounts')}>View all <ArrowRight size={15} /></button></div>
                    <div className="account-list">{accounts.slice(0, 3).map((account, index) => <AccountRow key={account._id} account={account} balance={balances[account._id]} index={index} />)}</div>
                  </div>
                  <div className="activity-panel">
                    <div className="section-title-row"><div><h2>Recent activity</h2><p>Transfers made in this session</p></div><span className="live-dot" title="Session activity" /></div>
                    {activity.length ? <div className="activity-list">{activity.slice(0, 4).map((item) => <ActivityRow item={item} key={item.id} />)}</div> : <div className="activity-empty"><span className="activity-empty-icon"><ArrowLeftRight size={19} /></span><strong>No transfers yet</strong><p>Your completed transfers will appear here.</p></div>}
                  </div>
                </section>
              )}
              <div className="bottom-note"><ShieldCheck size={16} /><span>Your banking information is protected. Balances update from your account ledger.</span></div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function AccountRow({ account, balance, index }) {
  return (
    <article className="account-row" style={{ animationDelay: `${index * 70}ms` }}>
      <span className="account-symbol"><Landmark size={19} /></span>
      <span className="account-main"><strong>Everyday account</strong><span>•••• {account._id.slice(-4)} <i /> {account.currency}</span></span>
      <span className="account-state"><i /> Active</span>
      <span className="account-balance">{formatMoney(balance, account.currency)}</span>
      <ChevronDown className="account-chevron" size={16} />
    </article>
  )
}

function ActivityRow({ item }) {
  return (
    <article className="activity-row">
      <span className="activity-icon"><ArrowUpRight size={17} /></span>
      <span className="activity-copy"><strong>Money sent</strong><span>{item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · To account •••• {item.toAccount.slice(-4)}</span></span>
      <span className="activity-amount">−{formatMoney(item.amount)}</span>
    </article>
  )
}

function EmptyState({ onCreate, busy }) {
  return (
    <section className="empty-state">
      <span className="empty-icon"><Wallet size={23} /></span>
      <h2>Start with an account</h2>
      <p>Open your personal account to see your balance and make transfers.</p>
      <button className="primary-button" onClick={onCreate} disabled={busy}>{busy ? 'Opening account…' : <><Plus size={16} /> Open account</>}</button>
    </section>
  )
}

function TransferForm({ accounts, balances, transfer, setTransfer, onSubmit, busy }) {
  const selectedAccount = accounts.find((account) => account._id === transfer.fromAccount)
  return (
    <section className="transfer-panel">
      <div className="transfer-heading"><span className="transfer-heading-icon"><ArrowLeftRight size={19} /></span><div><h2>Send money</h2><p>Transfers are sent securely through your account ledger.</p></div></div>
      {accounts.length === 0 ? <div className="transfer-empty"><Wallet size={22} /><strong>You need an account first</strong><p>Open an account before sending money.</p></div> : (
        <form className="transfer-form" onSubmit={onSubmit}>
          <label className="field-label">From account
            <select value={transfer.fromAccount} onChange={(event) => setTransfer({ ...transfer, fromAccount: event.target.value })} required>
              {accounts.map((account) => <option value={account._id} key={account._id}>Everyday account · •••• {account._id.slice(-4)} ({formatMoney(balances[account._id], account.currency)})</option>)}
            </select>
          </label>
          <label className="field-label">Recipient account ID
            <input type="text" value={transfer.toAccount} onChange={(event) => setTransfer({ ...transfer, toAccount: event.target.value.trim() })} placeholder="Paste recipient account ID" required />
            <span className="field-hint">Ask the recipient for their account ID.</span>
          </label>
          <label className="field-label">Amount
            <span className="amount-input-wrap"><span>₹</span><input type="number" min="0.01" step="0.01" value={transfer.amount} onChange={(event) => setTransfer({ ...transfer, amount: event.target.value })} placeholder="0.00" required /></span>
          </label>
          <div className="transfer-available"><span>Available to send</span><strong>{formatMoney(balances[selectedAccount?._id] || 0, selectedAccount?.currency || 'INR')}</strong></div>
          <button className="primary-button transfer-submit" type="submit" disabled={busy || !transfer.fromAccount}>{busy ? <><span className="button-spinner" /> Processing transfer…</> : <>Review and send <ArrowRight size={17} /></>}</button>
          <p className="transfer-disclaimer"><ShieldCheck size={14} /> Transfers may take a few seconds to process.</p>
        </form>
      )}
    </section>
  )
}

export default App
