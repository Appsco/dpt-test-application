<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

final class FrontController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function index()
    {
        return $this->render('front/base-front.html.twig');
    }

    #[Route('/old', name: 'home.old')]
    public function oldFront()
    {
        return $this->render('home.html.twig');
    }
}