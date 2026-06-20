import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useDeleteAccount } from './useDeleteAccount'

// Record the order in which the side effects fire
const order: string[] = []

const getUser = vi.fn()
const list = vi.fn()
const remove = vi.fn()
const rpc = vi.fn()
const signOut = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: () => getUser(),
      signOut: () => {
        order.push('signOut')
        return signOut()
      },
    },
    storage: {
      from: () => ({
        list: (...args: unknown[]) => {
          order.push('list')
          return list(...args)
        },
        remove: (...args: unknown[]) => {
          order.push('remove')
          return remove(...args)
        },
      }),
    },
    rpc: (...args: unknown[]) => {
      order.push('rpc')
      return rpc(...args)
    },
  },
}))

const navigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
}))

beforeEach(() => {
  order.length = 0
  getUser.mockReset()
  list.mockReset()
  remove.mockReset()
  rpc.mockReset()
  signOut.mockReset()
  navigate.mockReset()

  getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
  list.mockResolvedValue({ data: [{ name: 'avatar-1.png' }] })
  remove.mockResolvedValue({ data: null, error: null })
  rpc.mockResolvedValue({ error: null })
  signOut.mockResolvedValue(undefined)
})

describe('useDeleteAccount', () => {
  it('clears storage, deletes the user, then signs out — in that order', async () => {
    const { result } = renderHook(() => useDeleteAccount())
    await act(async () => {
      await result.current.deleteAccount()
    })

    expect(order).toEqual(['list', 'remove', 'rpc', 'signOut'])
  })

  it("removes the user's avatar files under their own folder", async () => {
    const { result } = renderHook(() => useDeleteAccount())
    await act(async () => {
      await result.current.deleteAccount()
    })

    expect(remove).toHaveBeenCalledWith(['user-1/avatar-1.png'])
  })

  it('calls the delete_user RPC and redirects to /login', async () => {
    const { result } = renderHook(() => useDeleteAccount())
    await act(async () => {
      await result.current.deleteAccount()
    })

    expect(rpc).toHaveBeenCalledWith('delete_user')
    expect(navigate).toHaveBeenCalledWith('/login', { replace: true })
  })

  it('stops before signing out when the RPC fails', async () => {
    rpc.mockResolvedValue({ error: new Error('boom') })
    const { result } = renderHook(() => useDeleteAccount())

    await act(async () => {
      await expect(result.current.deleteAccount()).rejects.toThrow()
    })

    expect(order).toEqual(['list', 'remove', 'rpc']) // never reached signOut
    expect(navigate).not.toHaveBeenCalled()
  })
})
