(module
  (memory (export "memory") 1 2)

  (func (export "sma") (param $ptr i32) (param $len i32) (result f64)
    (local $i i32)
    (local $sum f64)

    (local.set $i (i32.const 0))
    (local.set $sum (f64.const 0))

    (block $exit
      (loop $loop
        (br_if $exit
          (i32.ge_u (local.get $i) (local.get $len))
        )

        (local.set $sum
          (f64.add
            (local.get $sum)
            (f64.load
              (i32.add
                (local.get $ptr)
                (i32.mul (local.get $i) (i32.const 8))
              )
            )
          )
        )

        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $loop)
      )
    )

    (f64.div
      (local.get $sum)
      (f64.convert_i32_u (local.get $len))
    )
  )
)
