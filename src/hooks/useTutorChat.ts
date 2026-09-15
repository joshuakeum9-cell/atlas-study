import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { streamTutorReply, studentMessage, tutorMessage } from '@/services/ai'
import { uid } from '@/services/util'
import type { ChatMessage } from '@/types'
import { useStore } from '@/state/store'

export interface AskOptions {
  via?: 'text' | 'voice'
  /** Attached when the question is about a circled region. */
  context?: ChatMessage['context']
  /** Routes straight to the scripted analysis for that region. */
  regionAnalysisKey?: string
}

/**
 * Owns the tutor conversation for the current assignment: which conversation is
 * active, what is streaming, and how a question gets asked.
 *
 * Lives in a hook rather than in the panel so that the worksheet flow can ask a
 * question the moment a transcription is confirmed, without the panel having to
 * expose an imperative handle.
 */
export function useTutorChat() {
  const { state, dispatch, markExplored } = useStore()
  const cancelRef = useRef<(() => void) | null>(null)
  const [thinking, setThinking] = useState(false)

  const conversations = useMemo(
    () => state.conversations.filter((c) => c.assignmentId === state.assignmentId),
    [state.conversations, state.assignmentId],
  )

  const active = useMemo(
    () => state.conversations.find((c) => c.id === state.activeConversationId) ?? null,
    [state.conversations, state.activeConversationId],
  )

  const streaming =
    state.stream && active && state.stream.conversationId === active.id ? state.stream.text : null
  const busy = thinking || streaming !== null

  // Abandon any in-flight reply when the component using this hook unmounts.
  useEffect(
    () => () => {
      cancelRef.current?.()
      cancelRef.current = null
    },
    [],
  )

  const stop = useCallback(() => {
    cancelRef.current?.()
    cancelRef.current = null
    setThinking(false)
    dispatch({ type: 'stream-end' })
  }, [dispatch])

  const ask = useCallback(
    (question: string, options: AskOptions = {}) => {
      const text = question.trim()
      if (!text || busy) return

      // Start a conversation if this assignment has none yet.
      let conversationId = active?.id
      if (!conversationId) {
        conversationId = uid('conv')
        dispatch({ type: 'new-conversation', id: conversationId })
      }

      dispatch({
        type: 'append-message',
        conversationId,
        message: studentMessage(text, { via: options.via, context: options.context }),
      })
      markExplored('ask-tutor')
      if (options.via === 'voice') markExplored('voice')

      setThinking(true)
      const targetId = conversationId

      cancelRef.current = streamTutorReply(
        {
          question: text,
          regionAnalysisKey: options.regionAnalysisKey,
          context: {
            courseId: state.courseId,
            assignmentId: state.assignmentId,
            openDocIds: [state.activeDocId],
          },
        },
        {
          onStart: () => {
            setThinking(false)
            dispatch({ type: 'stream-start', conversationId: targetId })
          },
          onChunk: (chunk) => dispatch({ type: 'stream-chunk', chunk }),
          onDone: (reply) => {
            cancelRef.current = null
            dispatch({ type: 'stream-end' })
            dispatch({
              type: 'append-message',
              conversationId: targetId,
              message: tutorMessage(reply.text, reply),
            })
          },
        },
      )
    },
    [active?.id, busy, dispatch, markExplored, state.activeDocId, state.assignmentId, state.courseId],
  )

  const newConversation = useCallback(() => {
    stop()
    dispatch({ type: 'new-conversation' })
  }, [dispatch, stop])

  const selectConversation = useCallback(
    (conversationId: string) => {
      stop()
      dispatch({ type: 'select-conversation', conversationId })
    },
    [dispatch, stop],
  )

  return {
    conversations,
    active,
    messages: active?.messages ?? [],
    streaming,
    thinking,
    busy,
    ask,
    stop,
    newConversation,
    selectConversation,
  }
}
