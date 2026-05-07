export type Toy = {
  readonly name: string
  readonly path: string
  readonly description: string
  readonly status: 'ready' | 'wip'
}

export const toys = [
  {
    name: 'number-calc',
    path: '/number-calc',
    description: '4 桁数字パズル(21 に近づける)の解探索',
    status: 'ready',
  },
] as const satisfies readonly Toy[]
