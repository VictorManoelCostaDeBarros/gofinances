import React from "react";
import { renderHook, act } from '@testing-library/react-hooks'
import { mocked } from 'ts-jest/utils'
import { AuthProvider, useAuth } from './auth'
import * as AuthSession from 'expo-auth-session'

jest.mock('expo-auth-session')

describe('Auth Hook', () => {
  it('Should be able to sign in with Google account existing', async () => {
    const googleMocked = mocked(AuthSession.startAsync as any)
    googleMocked.mockReturnValueOnce({
      type: 'success',
      user: {
        id: 'any_id',
        email: 'victor.manoel8@hotmail.com',
        name: 'Victor',
        photo: 'any_photo'
      }
    })
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user.email).toBe('victor.manoel8@hotmail.com');
  })

  it('user should not connect if cancel authentication with Google', async () => {
    const googleMocked = mocked(AuthSession.startAsync as any)
    googleMocked.mockReturnValueOnce({
      type: 'cancel',
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user).not.toHaveProperty('id');
  })

  it('should be error if sign-in failled', async () => {

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    })

    try {

      await act(() => result.current.signInWithGoogle());
    } catch (error) {
      expect(result.current.user).toEqual({});

    }


  })
})