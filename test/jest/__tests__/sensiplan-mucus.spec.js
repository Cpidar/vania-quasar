import getSensiplanMucus from 'src/lib/nfp-mucus'

describe('getSensiplanMucus', () => {
  describe('results in t for:', () => {
    test('dry feeling and no texture', () => {
      const sensiplanValue = getSensiplanMucus(0, 0)
      expect(sensiplanValue).toBe(0)
    })
  })

  describe('results in Ø for:', () => {
    test('no feeling and no texture', () => {
      const sensiplanValue = getSensiplanMucus(1, 0)
      expect(sensiplanValue).toBe(1)
    })
  })

  describe('results in f for:', () => {
    test('wet feeling and no texture', () => {
      const sensiplanValue = getSensiplanMucus(2, 0)
      expect(sensiplanValue).toBe(2)
    })
  })

  describe('results in S for:', () => {
    test('dry feeling and creamy texture', () => {
      const sensiplanValue = getSensiplanMucus(0, 1)
      expect(sensiplanValue).toBe(3)
    })

    test('no feeling and creamy texture', () => {
      const sensiplanValue = getSensiplanMucus(1, 1)
      expect(sensiplanValue).toBe(3)
    })

    test('wet feeling and creamy texture', () => {
      const sensiplanValue = getSensiplanMucus(2, 1)
      expect(sensiplanValue).toBe(3)
    })
  })

  describe('results in +S for:', () => {
    test('dry feeling and egg white texture', () => {
      const sensiplanValue = getSensiplanMucus(0, 2)
      expect(sensiplanValue).toBe(4)
    })

    test('no feeling and egg white texture', () => {
      const sensiplanValue = getSensiplanMucus(1, 2)
      expect(sensiplanValue).toBe(4)
    })

    test('wet feeling and egg white texture', () => {
      const sensiplanValue = getSensiplanMucus(2, 2)
      expect(sensiplanValue).toBe(4)
    })

    test('slippery feeling and egg white texture', () => {
      const sensiplanValue = getSensiplanMucus(3, 2)
      expect(sensiplanValue).toBe(4)
    })

    test('slippery feeling and creamy texture', () => {
      const sensiplanValue = getSensiplanMucus(3, 1)
      expect(sensiplanValue).toBe(4)
    })

    test('slippery feeling and no texture', () => {
      const sensiplanValue = getSensiplanMucus(3, 0)
      expect(sensiplanValue).toBe(4)
    })
  })
})
