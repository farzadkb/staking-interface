import { useToast } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { ActionType, ERROR_DESC_INFORMATION_INCORRECT, toastConfig } from '../constants'
import { ActionInput } from '../types'
import { capitalizeFirstLetter } from '../utils'
import { useTx } from './useTx'

export const useManage = () => {
  const toast = useToast()
  const [deregister, setDeregister] = useState<string>('')
  const [addFunds, setAddFunds] = useState<ActionInput>({
    operatorId: '',
    amount: ''
  })
  const [withdraw, setWithdraw] = useState<ActionInput>({
    operatorId: '',
    amount: ''
  })
  const { handleDeregister, handleAddFunds, handleWithdraw } = useTx()

  const handleChange = useCallback(
    (actionType: ActionType, e: React.ChangeEvent<HTMLInputElement>) => {
      switch (actionType) {
        case ActionType.Deregister:
          setDeregister(e.target.value)
          break
        case ActionType.AddFunds:
          setAddFunds({ ...addFunds, [e.target.name]: e.target.value })
          break
        case ActionType.Withdraw:
          setWithdraw({ ...withdraw, [e.target.name]: e.target.value })
          break
      }
    },
    [addFunds, withdraw]
  )

  const handleSubmit = useCallback(
    async (actionType: ActionType) => {
      try {
        switch (actionType) {
          case ActionType.Deregister:
            return await handleDeregister(deregister)
          case ActionType.AddFunds:
            return await handleAddFunds(addFunds.operatorId, addFunds.amount)
          case ActionType.Withdraw:
            return await handleWithdraw(withdraw.operatorId, withdraw.amount)
        }
      } catch (error) {
        toast({
          title: 'Error: ' + capitalizeFirstLetter(actionType) + ' failed',
          description: ERROR_DESC_INFORMATION_INCORRECT,
          status: 'error',
          ...toastConfig
        })
      }
    },
    [addFunds, deregister, handleAddFunds, handleDeregister, handleWithdraw, toast, withdraw]
  )

  return {
    handleChange,
    handleSubmit
  }
}
