import type { Updater } from '@tanstack/react-table'
import type { Dispatch, SetStateAction } from 'react'

export function valueUpdater<T>(updaterOrValue: Updater<T>, setValue: Dispatch<SetStateAction<T>>) {
  setValue((old) => (typeof updaterOrValue === 'function' ? (updaterOrValue as (old: T) => T)(old) : updaterOrValue))
}
