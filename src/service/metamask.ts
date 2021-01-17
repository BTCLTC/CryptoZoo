/**
 * 判断是否处理连接状态
 */
export const isConnected = (): boolean => {
  return window.ethereum && window.ethereum.isConnected()
}

/**
 * 判断钱包是否解锁
 */
export const isUnlocked = async (): Promise<boolean> => {
  return window.ethereum._metamask.isUnlocked()
}

/**
 * 获取钱包账户
 */
export const getAccount = async (): Promise<void> => {
  const data = await window.ethereum.request({ method: 'eth_accounts' })
  if (data && Array.isArray(data)) {
    if (data.length) {
      address.value = data[0]
      getNetwork()
      getBalance()
    } else {
      // 钱包锁定或者没有创建账户
      checkWallet()
    }
  }
  // 进行监听钱包
  walletListener()
}

/**
 * 获取网络
 */
export const getNetwork = async (): Promise<void> => {
  const chainId = await window.ethereum.request({
    method: 'eth_chainId'
  })
  if (chainId !== HECO_CHAIN_ID) {
    // 非HECO主网
    console.log('非HECO主网')
  }
}

/**
 * 获取账户余额
 */
export const getBalance = async (): Promise<void> => {
  const walletBalance = await window.ethereum.request({
    method: 'eth_getBalance',
    params: [address.value, 'latest']
  })

  balance.value = walletBalance.toString()
  console.log(walletBalance)
}

/**
 * 判断钱包
 * 锁定状态
 * 没有创建账户
 */
export const checkWallet = async (): Promise<void> => {
  const unlocked = await isUnlocked()
  if (unlocked) {
    console.log('钱包没有创建账户')
    // 钱包没有创建账户
  } else {
    console.log('钱包被锁定提示')
    // 钱包被锁定提示
  }
}

/**
 * 监听钱包
 */
export const walletListener = (): void => {
  window.ethereum.on('accountsChanged', (accounts: [string]) => {
    // 授权地址改变
    if (accounts && Array.isArray(accounts)) {
      if (accounts.length) {
        address.value = accounts[0]
        getBalance()
      } else {
        // 钱包锁定或者没有创建账户
        checkWallet()
      }
    }
  })
  window.ethereum.on('chainChanged', (chainId: string) => {
    if (chainId !== HECO_CHAIN_ID) {
      // 非HECO主网
      console.log('非HECO主网')
    }
  })
}