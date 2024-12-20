import type { UnexpectedError } from '@livestore/common'
import type { Scope, WebChannel } from '@livestore/utils/effect'
import { Effect } from '@livestore/utils/effect'
import type { MeshNode } from '@livestore/webmesh'
import { connectViaWebSocket, makeMeshNode } from '@livestore/webmesh'

export const makeNodeDevtoolsConnectedMeshNode = ({
  nodeName,
  url,
}: {
  nodeName: string
  /** Example: `ws://localhost:1234` */
  url: string
}) =>
  Effect.gen(function* () {
    const node = yield* makeMeshNode(nodeName)

    yield* connectViaWebSocket({ node, url })

    return node
  })

export const makeChannelForConnectedMeshNode = <MsgListen, MsgSend, MsgListenEncoded, MsgSendEncoded>({
  target,
  node,
  schema,
}: {
  node: MeshNode
  target: string
  schema: WebChannel.InputSchema<MsgListen, MsgSend, MsgListenEncoded, MsgSendEncoded>
}) =>
  node.makeChannel({
    target,
    channelName: 'devtools:' + [node.nodeName, target].sort().join('_'),
    schema,
    mode: 'proxy',
  })

export const makeNodeDevtoolsChannel = <MsgListen, MsgSend, MsgListenEncoded, MsgSendEncoded>({
  nodeName,
  target,
  url,
  schema,
}: {
  nodeName: string
  target: string
  /** Example: `ws://localhost:1234` */
  url: string
  schema: WebChannel.InputSchema<MsgListen, MsgSend, MsgListenEncoded, MsgSendEncoded>
  // listenSchema: Schema.Schema<MsgListen, MsgListenEncoded>
  // sendSchema: Schema.Schema<MsgSend, MsgSendEncoded>
}): Effect.Effect<WebChannel.WebChannel<MsgListen, MsgSend>, UnexpectedError, Scope.Scope> =>
  Effect.gen(function* () {
    const node = yield* makeNodeDevtoolsConnectedMeshNode({ nodeName, url })

    const channel = yield* makeChannelForConnectedMeshNode({ node, target, schema })

    return channel
  }).pipe(Effect.withSpan(`devtools-node-common:makeNodeDevtoolsChannel`))
